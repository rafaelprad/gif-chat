export class Validator {
  static isNullUndefinedEmpty(value: any, trimText: boolean = false) {
    if (trimText && typeof value === 'string') {
      value = value.trim();
    }

    if (value === undefined || value === null || value === '') {
      return true;
    } else {
      return false;
    }
  }

  static isNullUndefined(value: any) {
    if (value === undefined || value === null) {
      return true;
    } else {
      return false;
    }
  }

  static isArray(value: any): Boolean {
    if (value instanceof Array) {
      return true;
    } else {
      return false;
    }
  }

  static isArrayWithItems(value: any): Boolean {
    if (!this.isNullUndefined(value) && this.isArray(value)) {
      if (value.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

Object.seal(Validator);
