import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Paso1StepPersonal from '../../src/components/forms/multi-step/pasos/Paso1StepPersonal.vue'

describe('Paso1StepPersonal.vue', () => {
  let wrapper: any

  const defaultProps = {
    formData: {
      first_name: '',
      last_name: '',
      rut: '',
      birth_date: '',
      gender: 'unspecified'
    }
  }

  const createWrapper = (props = defaultProps) => {
    return mount(Paso1StepPersonal, {
      props,
      global: {
        stubs: {
          FormKit: {
            template: `
              <div class="formkit-wrapper">
                <slot></slot>
              </div>
            `,
            props: ['name', 'modelValue', 'type', 'label', 'validation', 'placeholder', 'options', 'validationMessages', 'classes']
          },
          CheckCircleIcon: { 
            template: '<svg class="check-icon" data-testid="check-icon"></svg>' 
          },
          ExclamationCircleIcon: { 
            template: '<svg class="exclamation-icon" data-testid="exclamation-icon"></svg>' 
          }
        }
      }
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('Renderizado', () => {
    it('debe renderizar el componente correctamente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('debe mostrar el título "Datos Personales"', () => {
      expect(wrapper.find('h2').text()).toBe('Datos Personales')
    })

    it('debe mostrar el número de paso "1"', () => {
      expect(wrapper.find('.step-number').text()).toBe('1')
    })

    it('debe mostrar la descripción del paso', () => {
      const description = wrapper.find('.step-title p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Información básica')
    })

    it('debe renderizar el header del paso con las clases correctas', () => {
      const header = wrapper.find('.step-header')
      expect(header.exists()).toBe(true)
      expect(header.classes()).toContain('step-header')
    })
  })

  describe('Estructura del componente', () => {
    it('debe tener el contenedor principal con clase step-personal', () => {
      expect(wrapper.find('.step-personal').exists()).toBe(true)
    })

    it('debe renderizar el formulario principal', () => {
      const form = wrapper.find('[id="personal-form"]')
      expect(form.exists()).toBe(true)
    })

    it('debe tener el contenedor form-grid', () => {
      const html = wrapper.html()
      expect(html).toContain('form-grid')
    })
  })

  describe('Campos del Formulario', () => {
    it('debe inicializar los campos vacíos por defecto', () => {
      const vm = wrapper.vm as any
      expect(vm.localData.first_name).toBe('')
      expect(vm.localData.last_name).toBe('')
      expect(vm.localData.rut).toBe('')
      expect(vm.localData.birth_date).toBe('')
    })

    it('debe inicializar el género como "unspecified"', () => {
      const vm = wrapper.vm as any
      expect(vm.localData.gender).toBe('unspecified')
    })

    it('debe tener la estructura del formulario en el HTML', () => {
      const html = wrapper.html()
      expect(html).toContain('step-personal')
      expect(html).toContain('personal-form')
    })
  })

  describe('Validación del Formulario', () => {
    it('debe marcar el paso como inválido cuando los campos están vacíos', () => {
      const vm = wrapper.vm as any
      expect(vm.isStepValid).toBe(false)
    })

    it('debe marcar el paso como válido cuando se completan los campos requeridos', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      expect(vm.isStepValid).toBe(true)
    })

    it('debe validar que los nombres tengan al menos 2 caracteres', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'J'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      expect(vm.isStepValid).toBe(false)
    })

    it('debe validar que los apellidos tengan al menos 2 caracteres', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'P'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      expect(vm.isStepValid).toBe(false)
    })

    it('debe requerir fecha de nacimiento', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = ''
      
      await nextTick()
      expect(vm.isStepValid).toBe(false)
    })

    it('debe permitir nombres con exactamente 2 caracteres', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Jo'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      expect(vm.isStepValid).toBe(true)
    })

    it('debe permitir nombres largos', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan Carlos Alberto'
      vm.localData.last_name = 'Pérez González'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      expect(vm.isStepValid).toBe(true)
    })

    it('debe validar correctamente con todos los campos completos', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'María'
      vm.localData.last_name = 'González'
      vm.localData.rut = '12.345.678-9'
      vm.localData.birth_date = '2015-03-15'
      vm.localData.gender = 'female'
      
      await nextTick()
      expect(vm.isStepValid).toBe(true)
    })
  })

  describe('Cálculo de Edad', () => {
    it('debe calcular la edad correctamente para 10 años', async () => {
      const vm = wrapper.vm as any
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 10)
      
      vm.localData.birth_date = birthDate.toISOString().split('T')[0]
      await nextTick()
      
      expect(vm.calculatedAge).toBe(10)
    })

    it('debe calcular la edad correctamente para 5 años', async () => {
      const vm = wrapper.vm as any
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 5)
      
      vm.localData.birth_date = birthDate.toISOString().split('T')[0]
      await nextTick()
      
      expect(vm.calculatedAge).toBe(5)
    })

    it('debe retornar null cuando no hay fecha de nacimiento', () => {
      const vm = wrapper.vm as any
      vm.localData.birth_date = ''
      expect(vm.calculatedAge).toBe(null)
    })

    it('debe renderizar la información de edad cuando hay fecha válida', async () => {
      const vm = wrapper.vm as any
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 8)
      
      vm.localData.birth_date = birthDate.toISOString().split('T')[0]
      await nextTick()
      
      // Verificar que el campo calculatedAge existe y es correcto
      expect(vm.calculatedAge).toBe(8)
      
      // Verificar en el HTML
      const html = wrapper.html()
      expect(html).toContain('8 años')
    })

    it('debe mostrar texto de edad basado en fecha de nacimiento', async () => {
      const vm = wrapper.vm as any
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 7)
      
      vm.localData.birth_date = birthDate.toISOString().split('T')[0]
      await nextTick()
      
      const html = wrapper.html()
      expect(html).toContain('Basado en la fecha de nacimiento')
    })

    it('no debe mostrar información de edad cuando no hay fecha', async () => {
      const vm = wrapper.vm as any
      vm.localData.birth_date = ''
      await nextTick()
      
      expect(vm.calculatedAge).toBe(null)
      const html = wrapper.html()
      expect(html).not.toContain('años')
    })

    it('debe calcular correctamente cuando el cumpleaños no ha ocurrido este año', async () => {
      const vm = wrapper.vm as any
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 10, today.getMonth() + 1, today.getDate())
      
      vm.localData.birth_date = birthDate.toISOString().split('T')[0]
      await nextTick()
      
      // Debería ser 9 años porque el cumpleaños aún no ocurre
      expect(vm.calculatedAge).toBe(9)
    })
  })

  describe('Eventos Emitidos', () => {
    it('debe emitir update:formData cuando cambian los datos', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.handleFormChange()
      
      await nextTick()
      expect(wrapper.emitted('update:formData')).toBeTruthy()
      expect(wrapper.emitted('update:formData')?.length).toBeGreaterThan(0)
    })

    it('debe emitir los datos correctos en update:formData', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'María'
      vm.localData.last_name = 'López'
      vm.handleFormChange()
      
      await nextTick()
      const emitted = wrapper.emitted('update:formData')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toMatchObject({
        first_name: 'María',
        last_name: 'López'
      })
    })

    it('debe emitir validate con el estado correcto (válido)', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      
      vm.handleFormChange()
      await nextTick()
      
      const validateEvents = wrapper.emitted('validate')
      expect(validateEvents).toBeTruthy()
      expect(validateEvents![validateEvents!.length - 1]).toEqual([true])
    })

    it('debe emitir validate con false cuando el formulario es inválido', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'J'
      vm.handleFormChange()
      
      await nextTick()
      const validateEvents = wrapper.emitted('validate')
      expect(validateEvents).toBeTruthy()
      expect(validateEvents![validateEvents!.length - 1]).toEqual([false])
    })

    it('debe emitir ambos eventos al cambiar el formulario', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Test'
      vm.handleFormChange()
      
      await nextTick()
      expect(wrapper.emitted('update:formData')).toBeTruthy()
      expect(wrapper.emitted('validate')).toBeTruthy()
    })
  })

  describe('Método validate expuesto', () => {
    it('debe exponer el método validate', () => {
      const vm = wrapper.vm as any
      expect(typeof vm.validate).toBe('function')
    })

    it('el método validate debe retornar true cuando es válido', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      const result = vm.validate()
      expect(result).toBe(true)
    })

    it('el método validate debe retornar false cuando es inválido', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = ''
      vm.localData.last_name = ''
      vm.localData.birth_date = ''
      
      await nextTick()
      const result = vm.validate()
      expect(result).toBe(false)
    })

    it('el método validate debe emitir el evento validate', () => {
      const vm = wrapper.vm as any
      vm.validate()
      expect(wrapper.emitted('validate')).toBeTruthy()
    })
  })

  describe('Inicialización con datos previos', () => {
    it('debe cargar datos completos desde props', async () => {
      const propsWithData = {
        formData: {
          first_name: 'María',
          last_name: 'González',
          rut: '12.345.678-9',
          birth_date: '2016-05-15',
          gender: 'female'
        }
      }

      const wrapperWithData = createWrapper(propsWithData)
      await nextTick()
      
      const vm = wrapperWithData.vm as any
      expect(vm.localData.first_name).toBe('María')
      expect(vm.localData.last_name).toBe('González')
      expect(vm.localData.rut).toBe('12.345.678-9')
      expect(vm.localData.birth_date).toBe('2016-05-15')
      expect(vm.localData.gender).toBe('female')
    })

    it('debe mantener el género unspecified por defecto', () => {
      const vm = wrapper.vm as any
      expect(vm.localData.gender).toBe('unspecified')
    })

    it('debe cargar datos parciales correctamente', async () => {
      const partialProps = {
        formData: {
          first_name: 'Pedro',
          last_name: '',
          rut: '',
          birth_date: '',
          gender: 'male'
        }
      }

      const wrapperPartial = createWrapper(partialProps)
      await nextTick()
      
      const vm = wrapperPartial.vm as any
      expect(vm.localData.first_name).toBe('Pedro')
      expect(vm.localData.gender).toBe('male')
    })
  })

  describe('Indicador de validación', () => {
    it('debe tener información de validación en el HTML', () => {
      const html = wrapper.html()
      expect(html).toContain('validation-info')
    })

    it('debe mostrar mensaje según estado de validación en HTML', async () => {
      await nextTick()
      const html = wrapper.html()
      expect(html).toContain('Complete los campos obligatorios')
    })

    it('debe cambiar mensaje cuando el formulario es válido', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      const html = wrapper.html()
      expect(html).toContain('Todos los campos requeridos están completos')
    })

    it('debe aplicar clase is-valid cuando el formulario es válido', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      const html = wrapper.html()
      expect(html).toContain('is-valid')
    })

    it('debe mostrar el icono de error cuando es inválido', async () => {
      const vm = wrapper.vm as any
      await nextTick()
      
      // Verificar que el estado es inválido
      expect(vm.isStepValid).toBe(false)
      
      // Verificar que existe el contenedor de validación y el icono SVG
      const validationIcon = wrapper.find('.validation-icon')
      expect(validationIcon.exists()).toBe(true)
      
      // Verificar que hay un SVG (el icono de error)
      const svg = validationIcon.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it('debe mostrar el icono de éxito cuando es válido', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      
      await nextTick()
      
      // Verificar que el estado es válido
      expect(vm.isStepValid).toBe(true)
      
      // Verificar que existe el contenedor de validación y el icono SVG
      const validationIcon = wrapper.find('.validation-icon')
      expect(validationIcon.exists()).toBe(true)
      
      // Verificar que hay un SVG (el icono de éxito)
      const svg = validationIcon.find('svg')
      expect(svg.exists()).toBe(true)
      
      // Verificar que tiene la clase is-valid
      const validationInfo = wrapper.find('.validation-info')
      expect(validationInfo.classes()).toContain('is-valid')
    })
  })

  describe('Opciones de género', () => {
    it('debe tener las opciones de género definidas', () => {
      const vm = wrapper.vm as any
      expect(vm.genderOptions).toEqual({
        unspecified: 'No especifica',
        male: 'Masculino',
        female: 'Femenino',
        other: 'Otro'
      })
    })

    it('debe tener 4 opciones de género', () => {
      const vm = wrapper.vm as any
      const options = Object.keys(vm.genderOptions)
      expect(options.length).toBe(4)
    })

    it('debe incluir la opción "No especifica"', () => {
      const vm = wrapper.vm as any
      expect(vm.genderOptions.unspecified).toBe('No especifica')
    })

    it('debe incluir las opciones binarias', () => {
      const vm = wrapper.vm as any
      expect(vm.genderOptions.male).toBe('Masculino')
      expect(vm.genderOptions.female).toBe('Femenino')
    })

    it('debe incluir la opción "Otro"', () => {
      const vm = wrapper.vm as any
      expect(vm.genderOptions.other).toBe('Otro')
    })
  })

  describe('Campo RUT (opcional)', () => {
    it('debe permitir RUT vacío sin afectar validación', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      vm.localData.rut = ''
      
      await nextTick()
      expect(vm.isStepValid).toBe(true)
    })

    it('debe permitir RUT con formato válido', async () => {
      const vm = wrapper.vm as any
      vm.localData.first_name = 'Juan'
      vm.localData.last_name = 'Pérez'
      vm.localData.birth_date = '2015-01-01'
      vm.localData.rut = '12.345.678-9'
      
      await nextTick()
      expect(vm.isStepValid).toBe(true)
    })
  })

  describe('Reactivity', () => {
    it('debe actualizar isStepValid cuando cambian los datos', async () => {
      const vm = wrapper.vm as any
      expect(vm.isStepValid).toBe(false)
      
      vm.localData.first_name = 'Juan'
      await nextTick()
      expect(vm.isStepValid).toBe(false)
      
      vm.localData.last_name = 'Pérez'
      await nextTick()
      expect(vm.isStepValid).toBe(false)
      
      vm.localData.birth_date = '2015-01-01'
      await nextTick()
      expect(vm.isStepValid).toBe(true)
    })

    it('debe recalcular edad cuando cambia la fecha', async () => {
      const vm = wrapper.vm as any
      const date1 = new Date()
      date1.setFullYear(date1.getFullYear() - 5)
      vm.localData.birth_date = date1.toISOString().split('T')[0]
      await nextTick()
      expect(vm.calculatedAge).toBe(5)
      
      const date2 = new Date()
      date2.setFullYear(date2.getFullYear() - 10)
      vm.localData.birth_date = date2.toISOString().split('T')[0]
      await nextTick()
      expect(vm.calculatedAge).toBe(10)
    })
  })

  describe('Estilos y clases CSS', () => {
    it('debe tener la clase step-personal en el contenedor principal', () => {
      expect(wrapper.find('.step-personal').exists()).toBe(true)
    })

    it('debe aplicar las clases correctas al step-number', () => {
      const stepNumber = wrapper.find('.step-number')
      expect(stepNumber.exists()).toBe(true)
    })

    it('debe tener estructura del formulario en el HTML', () => {
      const html = wrapper.html()
      expect(html).toContain('form-grid')
    })
  })
})