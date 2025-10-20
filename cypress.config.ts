/* cypress.config.ts */
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 15000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    setupNodeEvents(on, config) {
      return config
    },
  },
  env: {
    API_BASE_URL: 'http://127.0.0.1:8000/api',
    TEST_EMAIL: 'camila.terapeuta@divermind.com',
    TEST_PASSWORD: 'pangaleluney2013'
  }
})