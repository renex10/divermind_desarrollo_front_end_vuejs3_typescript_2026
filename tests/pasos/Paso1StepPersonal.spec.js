"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var vue_1 = require("vue");
var Paso1StepPersonal_vue_1 = require("../../src/components/forms/multi-step/pasos/Paso1StepPersonal.vue");
(0, vitest_1.describe)('Paso1StepPersonal.vue', function () {
    var wrapper;
    var defaultProps = {
        formData: {
            first_name: '',
            last_name: '',
            rut: '',
            birth_date: '',
            gender: 'unspecified'
        }
    };
    var createWrapper = function (props) {
        if (props === void 0) { props = defaultProps; }
        return (0, test_utils_1.mount)(Paso1StepPersonal_vue_1.default, {
            props: props,
            global: {
                stubs: {
                    FormKit: {
                        template: "\n              <div class=\"formkit-wrapper\">\n                <slot></slot>\n              </div>\n            ",
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
        });
    };
    (0, vitest_1.beforeEach)(function () {
        wrapper = createWrapper();
    });
    (0, vitest_1.describe)('Renderizado', function () {
        (0, vitest_1.it)('debe renderizar el componente correctamente', function () {
            (0, vitest_1.expect)(wrapper.exists()).toBe(true);
        });
        (0, vitest_1.it)('debe mostrar el título "Datos Personales"', function () {
            (0, vitest_1.expect)(wrapper.find('h2').text()).toBe('Datos Personales');
        });
        (0, vitest_1.it)('debe mostrar el número de paso "1"', function () {
            (0, vitest_1.expect)(wrapper.find('.step-number').text()).toBe('1');
        });
        (0, vitest_1.it)('debe mostrar la descripción del paso', function () {
            var description = wrapper.find('.step-title p');
            (0, vitest_1.expect)(description.exists()).toBe(true);
            (0, vitest_1.expect)(description.text()).toContain('Información básica');
        });
        (0, vitest_1.it)('debe renderizar el header del paso con las clases correctas', function () {
            var header = wrapper.find('.step-header');
            (0, vitest_1.expect)(header.exists()).toBe(true);
            (0, vitest_1.expect)(header.classes()).toContain('step-header');
        });
    });
    (0, vitest_1.describe)('Estructura del componente', function () {
        (0, vitest_1.it)('debe tener el contenedor principal con clase step-personal', function () {
            (0, vitest_1.expect)(wrapper.find('.step-personal').exists()).toBe(true);
        });
        (0, vitest_1.it)('debe renderizar el formulario principal', function () {
            var form = wrapper.find('[id="personal-form"]');
            (0, vitest_1.expect)(form.exists()).toBe(true);
        });
        (0, vitest_1.it)('debe tener el contenedor form-grid', function () {
            var html = wrapper.html();
            (0, vitest_1.expect)(html).toContain('form-grid');
        });
    });
    (0, vitest_1.describe)('Campos del Formulario', function () {
        (0, vitest_1.it)('debe inicializar los campos vacíos por defecto', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(vm.localData.first_name).toBe('');
            (0, vitest_1.expect)(vm.localData.last_name).toBe('');
            (0, vitest_1.expect)(vm.localData.rut).toBe('');
            (0, vitest_1.expect)(vm.localData.birth_date).toBe('');
        });
        (0, vitest_1.it)('debe inicializar el género como "unspecified"', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(vm.localData.gender).toBe('unspecified');
        });
        (0, vitest_1.it)('debe tener la estructura del formulario en el HTML', function () {
            var html = wrapper.html();
            (0, vitest_1.expect)(html).toContain('step-personal');
            (0, vitest_1.expect)(html).toContain('personal-form');
        });
    });
    (0, vitest_1.describe)('Validación del Formulario', function () {
        (0, vitest_1.it)('debe marcar el paso como inválido cuando los campos están vacíos', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(vm.isStepValid).toBe(false);
        });
        (0, vitest_1.it)('debe marcar el paso como válido cuando se completan los campos requeridos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe validar que los nombres tengan al menos 2 caracteres', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'J';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe validar que los apellidos tengan al menos 2 caracteres', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'P';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe requerir fecha de nacimiento', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe permitir nombres con exactamente 2 caracteres', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Jo';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe permitir nombres largos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan Carlos Alberto';
                        vm.localData.last_name = 'Pérez González';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe validar correctamente con todos los campos completos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'María';
                        vm.localData.last_name = 'González';
                        vm.localData.rut = '12.345.678-9';
                        vm.localData.birth_date = '2015-03-15';
                        vm.localData.gender = 'female';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Cálculo de Edad', function () {
        (0, vitest_1.it)('debe calcular la edad correctamente para 10 años', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, birthDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        birthDate = new Date();
                        birthDate.setFullYear(birthDate.getFullYear() - 10);
                        vm.localData.birth_date = birthDate.toISOString().split('T')[0];
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.calculatedAge).toBe(10);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe calcular la edad correctamente para 5 años', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, birthDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        birthDate = new Date();
                        birthDate.setFullYear(birthDate.getFullYear() - 5);
                        vm.localData.birth_date = birthDate.toISOString().split('T')[0];
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.calculatedAge).toBe(5);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe retornar null cuando no hay fecha de nacimiento', function () {
            var vm = wrapper.vm;
            vm.localData.birth_date = '';
            (0, vitest_1.expect)(vm.calculatedAge).toBe(null);
        });
        (0, vitest_1.it)('debe renderizar la información de edad cuando hay fecha válida', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, birthDate, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        birthDate = new Date();
                        birthDate.setFullYear(birthDate.getFullYear() - 8);
                        vm.localData.birth_date = birthDate.toISOString().split('T')[0];
                        return [4 /*yield*/, (0, vue_1.nextTick)()
                            // Verificar que el campo calculatedAge existe y es correcto
                        ];
                    case 1:
                        _a.sent();
                        // Verificar que el campo calculatedAge existe y es correcto
                        (0, vitest_1.expect)(vm.calculatedAge).toBe(8);
                        html = wrapper.html();
                        (0, vitest_1.expect)(html).toContain('8 años');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe mostrar texto de edad basado en fecha de nacimiento', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, birthDate, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        birthDate = new Date();
                        birthDate.setFullYear(birthDate.getFullYear() - 7);
                        vm.localData.birth_date = birthDate.toISOString().split('T')[0];
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        html = wrapper.html();
                        (0, vitest_1.expect)(html).toContain('Basado en la fecha de nacimiento');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('no debe mostrar información de edad cuando no hay fecha', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.birth_date = '';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.calculatedAge).toBe(null);
                        html = wrapper.html();
                        (0, vitest_1.expect)(html).not.toContain('años');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe calcular correctamente cuando el cumpleaños no ha ocurrido este año', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, today, birthDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        today = new Date();
                        birthDate = new Date(today.getFullYear() - 10, today.getMonth() + 1, today.getDate());
                        vm.localData.birth_date = birthDate.toISOString().split('T')[0];
                        return [4 /*yield*/, (0, vue_1.nextTick)()
                            // Debería ser 9 años porque el cumpleaños aún no ocurre
                        ];
                    case 1:
                        _a.sent();
                        // Debería ser 9 años porque el cumpleaños aún no ocurre
                        (0, vitest_1.expect)(vm.calculatedAge).toBe(9);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Eventos Emitidos', function () {
        (0, vitest_1.it)('debe emitir update:formData cuando cambian los datos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.handleFormChange();
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _b.sent();
                        (0, vitest_1.expect)(wrapper.emitted('update:formData')).toBeTruthy();
                        (0, vitest_1.expect)((_a = wrapper.emitted('update:formData')) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe emitir los datos correctos en update:formData', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, emitted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'María';
                        vm.localData.last_name = 'López';
                        vm.handleFormChange();
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        emitted = wrapper.emitted('update:formData');
                        (0, vitest_1.expect)(emitted).toBeTruthy();
                        (0, vitest_1.expect)(emitted[0][0]).toMatchObject({
                            first_name: 'María',
                            last_name: 'López'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe emitir validate con el estado correcto (válido)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, validateEvents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        vm.handleFormChange();
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        validateEvents = wrapper.emitted('validate');
                        (0, vitest_1.expect)(validateEvents).toBeTruthy();
                        (0, vitest_1.expect)(validateEvents[validateEvents.length - 1]).toEqual([true]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe emitir validate con false cuando el formulario es inválido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, validateEvents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'J';
                        vm.handleFormChange();
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        validateEvents = wrapper.emitted('validate');
                        (0, vitest_1.expect)(validateEvents).toBeTruthy();
                        (0, vitest_1.expect)(validateEvents[validateEvents.length - 1]).toEqual([false]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe emitir ambos eventos al cambiar el formulario', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Test';
                        vm.handleFormChange();
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(wrapper.emitted('update:formData')).toBeTruthy();
                        (0, vitest_1.expect)(wrapper.emitted('validate')).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Método validate expuesto', function () {
        (0, vitest_1.it)('debe exponer el método validate', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(typeof vm.validate).toBe('function');
        });
        (0, vitest_1.it)('el método validate debe retornar true cuando es válido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        result = vm.validate();
                        (0, vitest_1.expect)(result).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('el método validate debe retornar false cuando es inválido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = '';
                        vm.localData.last_name = '';
                        vm.localData.birth_date = '';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        result = vm.validate();
                        (0, vitest_1.expect)(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('el método validate debe emitir el evento validate', function () {
            var vm = wrapper.vm;
            vm.validate();
            (0, vitest_1.expect)(wrapper.emitted('validate')).toBeTruthy();
        });
    });
    (0, vitest_1.describe)('Inicialización con datos previos', function () {
        (0, vitest_1.it)('debe cargar datos completos desde props', function () { return __awaiter(void 0, void 0, void 0, function () {
            var propsWithData, wrapperWithData, vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propsWithData = {
                            formData: {
                                first_name: 'María',
                                last_name: 'González',
                                rut: '12.345.678-9',
                                birth_date: '2016-05-15',
                                gender: 'female'
                            }
                        };
                        wrapperWithData = createWrapper(propsWithData);
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        vm = wrapperWithData.vm;
                        (0, vitest_1.expect)(vm.localData.first_name).toBe('María');
                        (0, vitest_1.expect)(vm.localData.last_name).toBe('González');
                        (0, vitest_1.expect)(vm.localData.rut).toBe('12.345.678-9');
                        (0, vitest_1.expect)(vm.localData.birth_date).toBe('2016-05-15');
                        (0, vitest_1.expect)(vm.localData.gender).toBe('female');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe mantener el género unspecified por defecto', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(vm.localData.gender).toBe('unspecified');
        });
        (0, vitest_1.it)('debe cargar datos parciales correctamente', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partialProps, wrapperPartial, vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partialProps = {
                            formData: {
                                first_name: 'Pedro',
                                last_name: '',
                                rut: '',
                                birth_date: '',
                                gender: 'male'
                            }
                        };
                        wrapperPartial = createWrapper(partialProps);
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        vm = wrapperPartial.vm;
                        (0, vitest_1.expect)(vm.localData.first_name).toBe('Pedro');
                        (0, vitest_1.expect)(vm.localData.gender).toBe('male');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Indicador de validación', function () {
        (0, vitest_1.it)('debe tener información de validación en el HTML', function () {
            var html = wrapper.html();
            (0, vitest_1.expect)(html).toContain('validation-info');
        });
        (0, vitest_1.it)('debe mostrar mensaje según estado de validación en HTML', function () { return __awaiter(void 0, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        html = wrapper.html();
                        (0, vitest_1.expect)(html).toContain('Complete los campos obligatorios');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe cambiar mensaje cuando el formulario es válido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        html = wrapper.html();
                        (0, vitest_1.expect)(html).toContain('Todos los campos requeridos están completos');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe aplicar clase is-valid cuando el formulario es válido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        html = wrapper.html();
                        (0, vitest_1.expect)(html).toContain('is-valid');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe mostrar el icono de error cuando es inválido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, validationIcon, svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        return [4 /*yield*/, (0, vue_1.nextTick)()
                            // Verificar que el estado es inválido
                        ];
                    case 1:
                        _a.sent();
                        // Verificar que el estado es inválido
                        (0, vitest_1.expect)(vm.isStepValid).toBe(false);
                        validationIcon = wrapper.find('.validation-icon');
                        (0, vitest_1.expect)(validationIcon.exists()).toBe(true);
                        svg = validationIcon.find('svg');
                        (0, vitest_1.expect)(svg.exists()).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe mostrar el icono de éxito cuando es válido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, validationIcon, svg, validationInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()
                            // Verificar que el estado es válido
                        ];
                    case 1:
                        _a.sent();
                        // Verificar que el estado es válido
                        (0, vitest_1.expect)(vm.isStepValid).toBe(true);
                        validationIcon = wrapper.find('.validation-icon');
                        (0, vitest_1.expect)(validationIcon.exists()).toBe(true);
                        svg = validationIcon.find('svg');
                        (0, vitest_1.expect)(svg.exists()).toBe(true);
                        validationInfo = wrapper.find('.validation-info');
                        (0, vitest_1.expect)(validationInfo.classes()).toContain('is-valid');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Opciones de género', function () {
        (0, vitest_1.it)('debe tener las opciones de género definidas', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(vm.genderOptions).toEqual({
                unspecified: 'No especifica',
                male: 'Masculino',
                female: 'Femenino',
                other: 'Otro'
            });
        });
        (0, vitest_1.it)('debe tener 4 opciones de género', function () {
            var vm = wrapper.vm;
            var options = Object.keys(vm.genderOptions);
            (0, vitest_1.expect)(options.length).toBe(4);
        });
        (0, vitest_1.it)('debe incluir la opción "No especifica"', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(vm.genderOptions.unspecified).toBe('No especifica');
        });
        (0, vitest_1.it)('debe incluir las opciones binarias', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(vm.genderOptions.male).toBe('Masculino');
            (0, vitest_1.expect)(vm.genderOptions.female).toBe('Femenino');
        });
        (0, vitest_1.it)('debe incluir la opción "Otro"', function () {
            var vm = wrapper.vm;
            (0, vitest_1.expect)(vm.genderOptions.other).toBe('Otro');
        });
    });
    (0, vitest_1.describe)('Campo RUT (opcional)', function () {
        (0, vitest_1.it)('debe permitir RUT vacío sin afectar validación', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        vm.localData.rut = '';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe permitir RUT con formato válido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        vm.localData.first_name = 'Juan';
                        vm.localData.last_name = 'Pérez';
                        vm.localData.birth_date = '2015-01-01';
                        vm.localData.rut = '12.345.678-9';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Reactivity', function () {
        (0, vitest_1.it)('debe actualizar isStepValid cuando cambian los datos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        (0, vitest_1.expect)(vm.isStepValid).toBe(false);
                        vm.localData.first_name = 'Juan';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(false);
                        vm.localData.last_name = 'Pérez';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(false);
                        vm.localData.birth_date = '2015-01-01';
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(vm.isStepValid).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('debe recalcular edad cuando cambia la fecha', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vm, date1, date2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = wrapper.vm;
                        date1 = new Date();
                        date1.setFullYear(date1.getFullYear() - 5);
                        vm.localData.birth_date = date1.toISOString().split('T')[0];
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(vm.calculatedAge).toBe(5);
                        date2 = new Date();
                        date2.setFullYear(date2.getFullYear() - 10);
                        vm.localData.birth_date = date2.toISOString().split('T')[0];
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(vm.calculatedAge).toBe(10);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Estilos y clases CSS', function () {
        (0, vitest_1.it)('debe tener la clase step-personal en el contenedor principal', function () {
            (0, vitest_1.expect)(wrapper.find('.step-personal').exists()).toBe(true);
        });
        (0, vitest_1.it)('debe aplicar las clases correctas al step-number', function () {
            var stepNumber = wrapper.find('.step-number');
            (0, vitest_1.expect)(stepNumber.exists()).toBe(true);
        });
        (0, vitest_1.it)('debe tener estructura del formulario en el HTML', function () {
            var html = wrapper.html();
            (0, vitest_1.expect)(html).toContain('form-grid');
        });
    });
});
