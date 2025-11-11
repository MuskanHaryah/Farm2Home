# Static Files Directory

This directory contains all static assets for the Farm2Home project.

## Structure

```
static/
├── css/          # CSS stylesheets
├── js/           # JavaScript files
└── images/       # Static images (fruits, vegetables, herbs)
    ├── fruits/
    ├── vegetables/
    └── herbs/
```

## Usage

In templates, load static files using:

```html
{% load static %}
<link rel="stylesheet" href="{% static 'css/style.css' %}">
<script src="{% static 'js/script.js' %}"></script>
<img src="{% static 'images/fruits/apple.png' %}" alt="Apple">
```

## Note

- CSS files from templates should be moved to `static/css/`
- JavaScript files should be moved to `static/js/`
- Images are already in `static/images/`
