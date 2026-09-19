# Intel 8080 CPU Emulator & Assembler - Version 2.2.0 (FPU Extension)

Bienvenidos al emulador y ensamblador de la arquitectura Intel 8080 con soporte para coprocesador matemático de punto flotante (FPU IEEE 754). Este proyecto ha sido construido utilizando tecnología 100% web pura (HTML5, CSS3 y Vanilla JavaScript) sin frameworks ni dependencias externas.

---

## 🌟 ¿Por qué nació este proyecto? (Historia y Propósito)

En la enseñanza de la informática y la arquitectura de computadoras, existe una brecha pedagógica crítica al transicionar de lenguajes de alto nivel al entendimiento del hardware real. Los simuladores tradicionales suelen ser complejos de configurar o carecen de retroalimentación gráfica inmediata.

**Este simulador democratiza el aprendizaje del hardware:** permite a los estudiantes "ver dentro" de una unidad central de procesamiento (CPU), inspeccionando cómo cambian los registros paso a paso, cómo interactúa la pila (*Stack*), cómo fluyen las banderas aritméticas (*flags*) y cómo se delegan operaciones matemáticas avanzadas a un coprocesador de hardware dedicado.

---

## 🚀 Novedades de la Versión 2.2.0 (Extensión FPU IEEE 754)

Esta versión introduce la emulación conceptual de un **Coprocesador Matemático de Punto Flotante**:
- **Unidad de Punto Flotante (FPU):** Implementación del estándar industrial **IEEE 754 (32 bits, precisión simple)** desacoplado de la CPU principal.
- **Comunicación por Puertos I/O:**
  - **Puerto `40H` (Control / Estado):** Recepción de opcodes aritméticos (`01H: FADD`, `02H: FSUB`, `03H: FMUL`, `04H: FDIV`) y reporte de errores (división entre cero, desbordamiento).
  - **Puerto `41H` (Canal de Datos):** Transmisión y recepción de números decimales serializados en tramas de 4 bytes (Little Endian).
- **FPU Coprocessor Dashboard:** Nuevo panel visual en la interfaz que monitoriza los registros internos `ST0` y `ST1`, la última operación matemática procesada y el byte de estado de control.
- **Novedades previas (v2.1.0):** Visualizador interactivo de pila (*Stack View*), tooltips didácticos para los flags (`S`, `Z`, `AC`, `P`, `CY`), botón *Clear Code* y reinicio profundo con puesta a cero de memoria.

---

## 📦 Características Principales

* **Núcleo de CPU Intel 8080 Completo:**
  * Emulación de instrucciones nativas y gestión estricta de banderas de condición.
  * Soporte de instrucciones de bus `IN` y `OUT` integradas al bus del coprocesador.
  * Soporte de ajuste decimal (`DAA`).
* **Coprocesador Matemático (FPU IEEE 754):**
  * Pila de registros de 32 bits (`ST0`, `ST1`).
  * Operaciones aritméticas reales de suma, resta, multiplicación y división con validación de excepciones.
* **Ensamblador Integrado:**
  * Mnemónicos estándar, directivas `ORG` y `DB`, etiquetas y alias dobles (`BC`, `DE`, `HL`).
* **Monitoreo Gráfico en Tiempo Real:**
  * Panel de registros de CPU y puntero de pila interactivo.
  * Panel de control de FPU.
  * Mapa bidimensional de memoria RAM con búsqueda rápida en hexadecimal.

---

## 📐 Ejemplo Rápido de Uso de la FPU (Suma: 2.5 + 3.0 = 5.5)

```assembly
ORG 0000H

; Cargar 2.5f en ST0 (Bytes: 00H, 00H, 20H, 40H)
MVI A, 00H
OUT 41H
MVI A, 00H
OUT 41H
MVI A, 20H
OUT 41H
MVI A, 40H
OUT 41H

; Cargar 3.0f en ST0 (desplaza 2.5f a ST1)
MVI A, 00H
OUT 41H
MVI A, 00H
OUT 41H
MVI A, 40H
OUT 41H
MVI A, 40H
OUT 41H

; Ejecutar FADD (Opcode 01H)
MVI A, 01H
OUT 40H

; Leer resultado de 32 bits desde la FPU
IN 41H         ; Byte 0: 00H
IN 41H         ; Byte 1: 00H
IN 41H         ; Byte 2: B0H
IN 41H         ; Byte 3: 40H (Resultado IEEE 754: 5.5)

HLT
```

---

## 💻 Guía de Inicio Rápido

Para ejecutar el simulador localmente:

1. Clonar o descargar este repositorio.
2. Abrir el archivo `index.html` en cualquier navegador moderno (o servir mediante `python -m http.server 8000`).
3. Escribe tu código ensamblador, presiona **Assemble & Load**, y controla la ejecución con **Run** o **Step**.

---

## 📝 Documentación del Proyecto

* **`INSTRUCTIONS.md`:** Manual didáctico completo para estudiantes que detalla la transición de alto a bajo nivel, estructuras de control, llamadas a funciones y el **Capítulo 6** dedicado al funcionamiento del coprocesador numérico FPU.

---
**Versión del Proyecto:** 2.2.0  
**Licencia:** MIT
