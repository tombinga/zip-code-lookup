# Form Validation with ZIP Code Verification

This documentation explains how to implement ZIP code validation for Patina Restaurant Group's email signup forms using the `form-validator.js` script.

## Features

- Validates US ZIP codes using the Zippopotamus API
- Supports both 5-digit (12345) and 9-digit (12345-1234) ZIP code formats
- Shows a modal for validation errors
- Caches validated ZIP codes for better performance
- Works with any form following the standard PRG structure
- Compatible with Bootstrap 3.3.5

## Implementation

### 1. Required Form Structure

Your form must have the following attributes and structure:

```html
<form id="SFMC_Form" ...>
  <!-- Other form fields -->
  <input id="postalCode" name="zipcode" type="text" required />
  <!-- Other form fields -->
</form>
```

Key requirements:
- Form must have `id="SFMC_Form"`
- ZIP code input must have `name="zipcode"`

### 2. Adding the Script

Add the following line just before your closing `</body>` tag:

```html
<script src="form-validator.js"></script>
```

That's it! The script will:
- Automatically create and inject the validation modal
- Add necessary styles
- Handle form submission and validation
- Show error messages if the ZIP code is invalid
- Submit the form if validation passes

### 3. Dependencies

- Bootstrap 3.3.5 (for styling)
- Internet connection (for ZIP code validation API)

### 4. How It Works

1. When the form is submitted:
   - The script prevents the default form submission
   - Validates the ZIP code format (must be either 12345 or 12345-1234)
   - Validates the ZIP code using the Zippopotamus API
   - If invalid: Shows an error modal
   - If valid: Submits the form normally

2. ZIP Code Validation:
   - Accepts both 5-digit (12345) and 9-digit (12345-1234) formats
   - For 9-digit codes, validates using the first 5 digits
   - Shows clear error message if format is incorrect

3. The validation modal:
   - Is automatically created and styled
   - Shows specific error messages
   - Can be closed by clicking a button

4. ZIP Code Caching:
   - Successfully validated ZIP codes are cached
   - Subsequent validations of the same ZIP code are instant
   - Cache persists until page reload

### 5. Error Handling

The script handles these scenarios:
- Invalid ZIP codes
- Network errors
- API failures

All errors show a user-friendly message in the modal.

## Example Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body>
    <form action="https://cloud.info.patinarestaurantgroup.com/profile" 
          name="subscribeForm" 
          method="post" 
          id="SFMC_Form">
        <!-- Your form fields -->
        <div class="form-group">
            <label for="postalCode">Postal Code*</label>
            <input id="postalCode" 
                   class="form-control" 
                   type="text" 
                   name="zipcode" 
                   required />
        </div>
        <button type="submit" class="btn btn-default btn-block btn-primary">
            Submit
        </button>
    </form>

    <script src="form-validator.js"></script>
</body>
</html>
```

## Troubleshooting

1. Modal not showing
   - Check if Bootstrap is properly loaded
   - Verify form and input IDs match requirements

2. Form submitting without validation
   - Verify form has `id="SFMC_Form"`
   - Check if script is loaded after form HTML

3. ZIP code always invalid
   - Check internet connection
   - Verify Zippopotamus API is accessible

## Support

For questions or issues, please contact the development team.
