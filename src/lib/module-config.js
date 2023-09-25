const dotenv = require("dotenv")

console.log(
  "========>",
  `${process.cwd()}/.env.${process.env.NODE_ENV || "development"}`
)

try {
  // Load environment variables from the appropriate .env file based on NODE_ENV
  const envFile = `${process.cwd()}/.env.${
    process.env.NODE_ENV || "development"
  }`
  dotenv.config({ path: envFile })
} catch (err) {
  console.error("Error loading environment variables:", err)
}

/**
 * EnvironmentVariables class for managing environment variables.
 */
class EnvironmentVariables {
  /**
   * Create an instance of the EnvironmentVariables class.
   * @param {string} [env] - The environment name (e.g., 'production', 'development').
   */
  constructor(env) {
    this.env = env || process.env.NODE_ENV || "development"
  }

  /**
   * Get the value of an environment variable.
   * @param {string} key - The name of the environment variable.
   * @param {*} [defaultValue] - The default value to return if the environment variable is not found.
   * @returns {*} The value of the environment variable or the default value.
   */
  get(key, defaultValue = undefined) {
    const envKey = `${this.env.toUpperCase()}_${key.toUpperCase()}`
    try {
      return process.env[envKey] || defaultValue
    } catch (err) {
      console.error(`Error getting ${key}:`, err)
      return defaultValue
    }
  }

  /**
   * Get the value of an environment variable as a string.
   * @param {string} key - The name of the environment variable.
   * @param {string} [defaultValue] - The default value to return if the environment variable is not found.
   * @returns {string|undefined} The value of the environment variable as a string or the default value.
   */
  getString(key, defaultValue = undefined) {
    const value = this.get(key)
    return value !== undefined ? value.toString() : defaultValue
  }

  /**
   * Get the value of an environment variable as a boolean.
   * @param {string} key - The name of the environment variable.
   * @param {boolean} [defaultValue] - The default value to return if the environment variable is not found.
   * @returns {boolean|undefined} The value of the environment variable as a boolean or the default value.
   */
  getBoolean(key, defaultValue = undefined) {
    const value = this.getString(key)
    return value !== undefined ? value.toLowerCase() === "true" : defaultValue
  }

  /**
   * Get the value of an environment variable as a number.
   * @param {string} key - The name of the environment variable.
   * @param {number} [defaultValue] - The default value to return if the environment variable is not found.
   * @returns {number|undefined} The value of the environment variable as a number or the default value.
   */
  getNumber(key, defaultValue = undefined) {
    const value = this.getString(key)
    return value !== undefined ? parseFloat(value) : defaultValue
  }

  /**
   * Get the value of an environment variable as an array.
   * @param {string} key - The name of the environment variable.
   * @param {string} [separator] - The separator to split the value by (default: ',').
   * @param {string[]} [defaultValue] - The default value to return if the environment variable is not found.
   * @returns {string[]|undefined} The value of the environment variable as an array or the default value.
   */
  getArray(key, separator = ",", defaultValue = undefined) {
    const value = this.getString(key)
    return value !== undefined ? value.split(separator) : defaultValue
  }

  /**
   * Get the value of an environment variable as an object (parsed from JSON).
   * @param {string} key - The name of the environment variable.
   * @param {*} [defaultValue] - The default value to return if the environment variable is not found or cannot be parsed.
   * @returns {*} The value of the environment variable as an object or the default value.
   */
  getObject(key, defaultValue = undefined) {
    const value = this.getString(key)
    try {
      return value !== undefined ? JSON.parse(value) : defaultValue
    } catch (err) {
      console.error(`Error parsing JSON for ${key}:`, err)
      return defaultValue
    }
  }

  /**
   * Get the value of an environment variable or throw an error if it's not found.
   * @param {string} propertyPath - The name of the environment variable.
   * @param {Object} [options] - Options for controlling behavior.
   * @param {boolean} [options.throwError=true] - Whether to throw an error if the environment variable is not found.
   * @returns {*} The value of the environment variable.
   * @throws {Error} If the environment variable is not found and options.throwError is true.
   */
  getOrThrow(propertyPath, options = { throwError: true }) {
    const value = this.get(propertyPath)
    if (value === undefined && options.throwError) {
      throw new Error(`Environment variable '${propertyPath}' not found.`)
    }
    return value
  }
}

module.exports = new EnvironmentVariables()
