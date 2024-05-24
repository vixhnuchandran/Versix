export interface SetDataRequest {
  id: any
  name: any
  data: any
}

export interface GetDataRequest {
  id: any
  name: any
  version?: any
}

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export const validateSetDataReq = (obj: SetDataRequest): ValidationResult => {
  if (!obj.id || typeof obj.id !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'id'. Must be a non-empty string.",
    }
  }

  if (!obj.name || typeof obj.name !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'name'. Must be a non-empty string.",
    }
  }

  if (!obj.data || typeof obj.data !== "object") {
    return {
      isValid: false,
      message: "Invalid or missing 'data'. Must be a non-null object.",
    }
  }

  return { isValid: true }
}

export const validateGetDataReq = (obj: GetDataRequest): ValidationResult => {
  if (!obj.id || typeof obj.id !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'id'. Must be a non-empty string.",
    }
  }

  if (!obj.name || typeof obj.name !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'name'. Must be a non-empty string.",
    }
  }

  if (obj.version !== undefined && typeof obj.version !== "number") {
    return {
      isValid: false,
      message: "Invalid 'version'. Must be a number if provided.",
    }
  }

  return { isValid: true }
}
