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

export const validateSetDataReq = (
  obj: any,
  isMultipart: string | boolean
): ValidationResult => {
  // Check for 'data' based on content type
  if (isMultipart) {
    if (!obj.file && (!obj.data || obj.data === "null")) {
      return {
        isValid: false,
        message: "Invalid or missing 'data' in multipart form data.",
      }
    }
  } else {
    if (!obj.data) {
      return {
        isValid: false,
        message: "Invalid or missing 'data' in JSON body.",
      }
    }
  }

  // Validate 'dataset'
  if (!obj.dataset || typeof obj.dataset !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'dataset'. Must be a non-empty string.",
    }
  }

  // Validate 'id'
  if (!obj.id || typeof obj.id !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'id'. Must be a non-empty string.",
    }
  }

  // Validate 'name'
  if (!obj.name || typeof obj.name !== "string") {
    return {
      isValid: false,
      message: "Invalid or missing 'name'. Must be a non-empty string.",
    }
  }

  // Validate 'isReplace'
  const isReplace =
    obj.isReplace === "true"
      ? true
      : obj.isReplace === "false"
      ? false
      : obj.isReplace
  if (typeof isReplace !== "boolean") {
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
