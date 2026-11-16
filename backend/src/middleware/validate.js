// Input validation helpers

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Full name is required');
  }

  if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      errors,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password',
    });
  }
  next();
};

const validatePet = (req, res, next) => {
  const { name, species, breed, age, gender, size, photos, description } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Pet name is required');
  if (!species || !['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'].includes(species)) {
    errors.push('Species must be Dog, Cat, Rabbit, Bird, or Other');
  }
  if (!breed || !breed.trim()) errors.push('Breed is required');
  if (age === undefined || age === null || isNaN(Number(age)) || Number(age) < 0) {
    errors.push('Valid age is required (0 or greater)');
  }
  if (!gender || !['Male', 'Female'].includes(gender)) {
    errors.push('Gender must be Male or Female');
  }
  if (!size || !['Small', 'Medium', 'Large', 'Extra Large'].includes(size)) {
    errors.push('Size must be Small, Medium, Large, or Extra Large');
  }
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    errors.push('At least one photo URL is required');
  }
  if (!description || !description.trim()) errors.push('Description is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      errors,
    });
  }

  next();
};

const validateApplication = (req, res, next) => {
  const { petId, fullName, email, phone, address, reasonForAdoption } = req.body;
  const errors = [];

  if (!petId) errors.push('Pet ID is required');
  if (!fullName || !fullName.trim()) errors.push('Applicant full name is required');
  if (!email || !email.trim()) errors.push('Applicant email is required');
  if (!phone || !phone.trim()) errors.push('Applicant phone number is required');
  if (!address || !address.trim()) errors.push('Applicant address is required');
  if (!reasonForAdoption || reasonForAdoption.trim().length < 10) {
    errors.push('Please describe why you wish to adopt (minimum 10 characters)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      errors,
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePet,
  validateApplication,
};
