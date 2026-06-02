 // ---- Single source of truth for field validation ----
 export const validateField = (name, value) => {
    const raw = typeof value === "string" ? value : "";
    const trimmed = raw.trim();

    switch (name) {
      case "companyName":
        if (!trimmed) return "Company name is required";
        if (trimmed.length < 2)
          return "Company name must be at least 2 characters";
        return "";

      case "buyerName":
        if (!trimmed) return "Buyer name is required";
        if (trimmed.length < 2)
          return "Buyer name must be at least 2 characters";
        return "";

      case "emailId": {
        if (!trimmed) return "Email is required";

        //  Block spaces
        if (/\s/.test(trimmed)) {
          return "Email must not contain spaces";
        }

        //  Block uppercase letters
        if (/[A-Z]/.test(trimmed)) {
          return "Only lowercase letters are allowed";
        }

        //  Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          return "Please enter a valid email address";
        }

        //  Allow only Gmail
        if (!trimmed.endsWith("@gmail.com")) {
          return "Only Gmail addresses are allowed";
        }

        return "";
      }

      case "phoneNumber": {
        const digits = trimmed.replace(/\D/g, "");
        if (!digits) return "Phone number is required";
        // if (!/^\d+$/.test(digits) || digits.length !== 10) {
        //   return "Phone number must be exactly 10 digits";
        // }
        return "";
      }

      case "companyDomain": {
        const compact = trimmed.replace(/\s+/g, "");
        const domainRegex = /\.(com|in|io|ai|net|org)$/i;
        if (!compact) return "Company domain is required";
        if (!domainRegex.test(compact)) {
          return "Domain must end with .com, .in, .io, .ai, .net, or .org";
        }
        return "";
      }

      case "streetAddress":
        if (!trimmed) return "Street address is required";
        if (trimmed.length < 5) return "Please enter a complete street address";
        return "";

      case "area":
        if (!trimmed) return "Area is required";
        if (trimmed.length < 2) return "Please enter a valid area name";
        return "";

      case "city":
        if (!trimmed) return "City is required";
        if (trimmed.length < 2) return "Please enter a valid city name";
        return "";

      case "pincode": {
        const digits = trimmed.replace(/\D/g, "");
        if (!digits) return "Pincode is required";
        // if (!/^\d+$/.test(digits)) return "Pincode must contain only numbers";
        // if (digits.length < 4) return "Pincode must be at least 4 digits";
        return "";
      }

      case "country":
        if (!trimmed) return "Country is required";
        return "";

      case "countryCode":
        if (!trimmed) return "Country code is required";
        return "";

      default:
        return "";
    }
  };