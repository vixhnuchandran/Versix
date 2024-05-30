export interface SetDataRequest {
  dataset: any
  id: any
  name: any
  data: any
  replace: string
}

export interface GetDataRequest {
  dataset: any
  id: any
  name: any
  version?: any
}

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export const validateSetDataReq = (obj: any): ValidationResult => {
  if (!obj.dataset || typeof obj.dataset !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'dataset'. Must be a non-empty string.",
    }
  }
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

  if (typeof obj.isReplace !== "boolean") {
    return {
      isValid: false,
      message:
        "Invalid or missing 'replace'. Must be either 'true' or 'false'.",
    }
  }
  return { isValid: true }
}

export const validateGetDataReq = (obj: GetDataRequest): ValidationResult => {
  if (!obj.dataset || typeof obj.dataset !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'dataset'. Must be a non-empty string.",
    }
  }
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
