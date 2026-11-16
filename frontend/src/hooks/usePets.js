import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useDebounce } from './useDebounce';

export const usePets = (initialFilters = {}) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    species: 'All',
    gender: 'All',
    size: 'All',
    status: 'All',
    sort: 'newest',
    page: 1,
    limit: 9,
    ...initialFilters,
  });

  const debouncedSearch = useDebounce(filters.search, 350);
  const { socket } = useSocket();

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        search: debouncedSearch,
      };
      if (params.species === 'All') delete params.species;
      if (params.gender === 'All') delete params.gender;
      if (params.size === 'All') delete params.size;
      if (params.status === 'All') delete params.status;

      const res = await api.pets.getAll(params);
      setPets(res.pets);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.species, filters.gender, filters.size, filters.status, filters.sort, filters.page, filters.limit]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handlePetUpdated = () => {
      fetchPets();
    };

    socket.on('pet_created', handlePetUpdated);
    socket.on('pet_updated', handlePetUpdated);
    socket.on('pet_deleted', handlePetUpdated);

    return () => {
      socket.off('pet_created', handlePetUpdated);
      socket.off('pet_updated', handlePetUpdated);
      socket.off('pet_deleted', handlePetUpdated);
    };
  }, [socket, fetchPets]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // reset page to 1 when filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      species: 'All',
      gender: 'All',
      size: 'All',
      status: 'All',
      sort: 'newest',
      page: 1,
      limit: 9,
    });
  };

  return {
    pets,
    loading,
    error,
    totalPages,
    totalCount,
    filters,
    updateFilter,
    resetFilters,
    refetch: fetchPets,
  };
};
