# Project Folder Structure


We follow the usual  folder structure in most express projects. Here is a walkthrough of different folders .


## 1. Loose-files

This directory holds individual components that contributors can develop independently before integration into the main Express app. It allows for modular development without requiring full knowledge of the project's stack.

## 2. Models

The Models directory contains MongoDB database schema using the Mongoose npm module. If you intend to upgrade database collections, this is the ideal starting point.

## 3. node_modules

Generated after running `npm run dev`, this folder contains npm modules and is typically not manually modified.

## 4. Views

### EJS Files

The `views` directory stores EJS files, where HTML changes can be made. The structure includes:

- **Partials:** Common elements like navbar and footer.
- **Layouts:** General boilerplate code.
- **Pages:** Main pages of the app.
- **Features:** Specific features of the app.

In the boilerplate, layout files attach common partials, and main files from features or pages call these layout files for display.

## 5. Public

This directory contains static client-side resources:

### CSS Folder

- **Bootstrap Integration:** We use Bootstrap so the css files are typically  simple.

### Javascript Folder

- **Developmental Scripts:** Files in `public/javascript/original` are unminified and used during development.
- **Production Scripts:** Files in `public/javascript/` are minified and utilized in production.
- **feature_scripts.js:** they contain the main logic of our app.
- **FFmpeg:** Holds locally placed files from the npm module `ffmpeg.wasm` used in developmental mode.

- **feature_scripts.js:** they contain the main logic of our app.

### PWA Files

- `public/manifest.json`: Configures the appearance of our app.
- `public/sw.js`: The service worker crucial for PWA behavior, enabling offline usage and installation.

## 6. Routes

In the `routes` directory, API endpoints are specified across four main files:

- **user.js:** Manages routes related to user accounts, including regular and Google authentication.
- **info.js:** Contains routes for the about us page.
- **features.js:** Includes routes for all implemented features.
- **test.js:** Self-explanatory test routes.

## 7. Utilities

The `utilities` directory contains essential helper functions:

- **Async Wrapper and AppError:** Important utilities in the Express.js file.
- **middlewares.js:** Includes crucial middleware to check user authentication.

This well-organized structure facilitates efficient development and maintenance of the Project-V application.
