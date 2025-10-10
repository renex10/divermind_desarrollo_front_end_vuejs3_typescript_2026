import { config } from '@vue/test-utils'
import { plugin, defaultConfig } from '@formkit/vue'

// Mock de FormKit para tests
config.global.plugins = [
  [plugin, defaultConfig]
]

// Mock de heroicons si es necesario
config.global.stubs = {
  CheckCircleIcon: true,
  ExclamationCircleIcon: true
}