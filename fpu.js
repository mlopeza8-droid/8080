// Coprocesador Matemático de Punto Flotante (IEEE 754 - 32 bits)
class FPU8080 {
  constructor() {
    this.reset();
  }

  reset() {
    this.bufferIn = [];
    this.bufferOut = [];
    this.regA = 0.0;     // Operando principal / Resultado
    this.regB = 0.0;     // Segundo operando
    this.lastOp = "IDLE";
    this.status = 0x00;  // 0x00: OK, 0x01: Error (división por cero)
  }

  writePort(port, value) {
    if (port === 0x41) { 
      // Puerto 0x41: Entrada de datos byte a byte (4 bytes = Float32)
      this.bufferIn.push(value & 0xFF);
      if (this.bufferIn.length === 4) {
        const u8 = new Uint8Array(this.bufferIn);
        const f32 = new Float32Array(u8.buffer)[0];
        this.bufferIn = [];
        this.regB = this.regA;
        this.regA = f32;
      }
    } else if (port === 0x40) { 
      // Puerto 0x40: Envío de comando/operación
      this.execute(value);
    }
  }

  readPort(port) {
    if (port === 0x40) return this.status;
    if (port === 0x41) {
      // Puerto 0x41: Lectura de los 4 bytes del resultado
      return this.bufferOut.length > 0 ? this.bufferOut.shift() : 0x00;
    }
    return 0xFF;
  }

  execute(cmd) {
    let res = 0.0;
    this.status = 0x00;

    switch (cmd) {
      case 0x01: // FADD (Suma)
        res = this.regB + this.regA;
        this.lastOp = "FADD";
        break;
      case 0x02: // FSUB (Resta)
        res = this.regB - this.regA;
        this.lastOp = "FSUB";
        break;
      case 0x03: // FMUL (Multiplicación)
        res = this.regB * this.regA;
        this.lastOp = "FMUL";
        break;
      case 0x04: // FDIV (División)
        if (this.regA === 0) {
          this.status = 0x01;
          res = NaN;
        } else {
          res = this.regB / this.regA;
        }
        this.lastOp = "FDIV";
        break;
      default:
        this.status = 0x02;
        return;
    }

    // Convertir el número decimal a sus 4 bytes IEEE 754
    const f32 = new Float32Array([res]);
    const u8 = new Uint8Array(f32.buffer);
    this.bufferOut = Array.from(u8);
    this.regA = res;
  }
}

// Instancia global accesible para la CPU y la interfaz
const fpu = new FPU8080();