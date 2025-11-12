# 🔄 Backend Integration Guide for Product Catalog

## ✅ **COMPLETED: Serializers Updated**

The `serializers.py` file has been updated with a new **`ProductCatalogSerializer`** that perfectly matches your frontend JavaScript data structure.

---

## 📋 **What Changed in Serializers**

### **New Serializer Added: `ProductCatalogSerializer`**

This serializer transforms database fields to match the exact structure your `script.js` expects:

```python
{
    "id": 1,                    # Maps from product_id
    "name": "Tomato",           # English name
    "variety": "Tamatar",       # Maps from local_name
    "price": 120,               # Price per kg
    "image": "/static/images/vegetables/tomato.png",
    "category": "vegetables",   # vegetables/fruits/herbs
    "season": "summer",         # Converts SUMMER → summer
    "inStock": true,            # Computed from inventory
    "inSeasonNow": true,        # Computed based on current date
    "stock_available": 50,      # From inventory table
    "discount": 0.00,           # Discount percentage
    "slug": "tomato"            # URL slug
}
```

### **Key Features:**
✅ **Field Mapping**: Automatically converts `product_id` → `id`, `local_name` → `variety`  
✅ **Season Logic**: Determines if product is in season based on current month  
✅ **Stock Status**: Checks inventory to set `inStock` boolean  
✅ **Image Paths**: Handles image URLs with fallback defaults  
✅ **Season Conversion**: `SUMMER` → `summer`, `WINTER` → `winter`, `ALL_YEAR` → `year-round`

---

## 🔧 **FILES THAT NEED MODIFICATION**

### **1. `views.py` - Add API Endpoint** ⚠️ **REQUIRED**

Add a new API endpoint to serve catalog products:

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ProductCatalogSerializer

@api_view(['GET'])
def catalog_products_api(request):
    """
    API endpoint for product catalog page
    Returns products in format matching frontend JavaScript
    """
    products = Product.objects.filter(is_active=True).select_related('inventory')
    
    # Apply filters from query parameters
    category = request.GET.get('category')
    if category:
        products = products.filter(category=category)
    
    season = request.GET.get('season')
    if season:
        # Convert frontend format (summer) to DB format (SUMMER)
        season_mapping = {
            'summer': 'SUMMER',
            'winter': 'WINTER',
            'year-round': 'ALL_YEAR'
        }
        db_season = season_mapping.get(season)
        if db_season:
            products = products.filter(season=db_season)
    
    in_stock = request.GET.get('in_stock')
    if in_stock == 'true':
        products = products.filter(inventory__stock_available__gt=0)
    
    search = request.GET.get('search')
    if search:
        products = products.filter(
            Q(name__icontains=search) | Q(local_name__icontains=search)
        )
    
    # Order by category and name
    products = products.order_by('category', 'name')
    
    serializer = ProductCatalogSerializer(products, many=True)
    return Response(serializer.data)
```

---

### **2. `urls.py` - Register New Route** ⚠️ **REQUIRED**

Add URL pattern for the new API endpoint:

```python
from django.urls import path
from . import views

urlpatterns = [
    # ... existing patterns ...
    
    # API endpoint for catalog products
    path('api/catalog/products/', views.catalog_products_api, name='catalog_products_api'),
    
    # ... rest of patterns ...
]
```

---

### **3. `script.js` - Fetch from Backend** ⚠️ **REQUIRED**

Replace the hardcoded `productsData` array with a fetch call:

**BEFORE (Lines 1-500+):**
```javascript
const productsData = [
    { id: 1, name: 'Tomato', variety: 'Tamatar', ... },
    { id: 2, name: 'Potato', variety: 'Aloo', ... },
    // ... 56 hardcoded products
];
```

**AFTER:**
```javascript
// ===============================================
// PRODUCTS DATA - LOADED FROM BACKEND
// ===============================================
let productsData = [];  // Will be populated from API

// ===============================================
// INITIALIZATION
// ===============================================
document.addEventListener('DOMContentLoaded', async function() {
    await loadProductsFromBackend();
    initializeApp();
});

async function loadProductsFromBackend() {
    try {
        const response = await fetch('/api/catalog/products/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productsData = await response.json();
        console.log(`Loaded ${productsData.length} products from backend`);
    } catch (error) {
        console.error('Error loading products:', error);
        notifications.error('Failed to load products. Please refresh the page.');
        // Fallback: Keep empty array or show error UI
        productsData = [];
    }
}

// Rest of the code remains the same
function initializeApp() {
    console.log('Initializing Farm2Home app...');
    
    // Initialize product quantities
    productsData.forEach(product => {
        productQuantities[product.id] = 0;
    });
    
    // ... rest of initialization code ...
}
```

---

### **4. Optional: Add Loading State to HTML** 💡 **RECOMMENDED**

Add a loading spinner in `prod-catalog/index.html`:

```html
<!-- Add this inside products-section, before products-grid -->
<div id="loadingSpinner" class="loading-spinner">
    <i class="fas fa-spinner fa-spin"></i>
    <p>Loading fresh products...</p>
</div>

<!-- Add this CSS to styles.css -->
<style>
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: var(--text-gray);
}

.loading-spinner i {
    font-size: 48px;
    color: var(--primary-green);
    margin-bottom: 16px;
}

.loading-spinner.hidden {
    display: none;
}
</style>
```

Then update `script.js` to hide spinner:

```javascript
async function loadProductsFromBackend() {
    const spinner = document.getElementById('loadingSpinner');
    
    try {
        const response = await fetch('/api/catalog/products/');
        productsData = await response.json();
        
        if (spinner) spinner.classList.add('hidden');
        console.log(`Loaded ${productsData.length} products`);
    } catch (error) {
        console.error('Error:', error);
        if (spinner) {
            spinner.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>Failed to load products</p>';
        }
    }
}
```

---

## 🎯 **Summary of Changes Needed**

| File | Status | Action Required |
|------|--------|-----------------|
| ✅ `serializers.py` | **DONE** | No action needed |
| ⚠️ `views.py` | **TODO** | Add `catalog_products_api()` function |
| ⚠️ `urls.py` | **TODO** | Add route: `path('api/catalog/products/', ...)` |
| ⚠️ `script.js` | **TODO** | Replace hardcoded data with `fetch()` call |
| 💡 `index.html` | **OPTIONAL** | Add loading spinner |

---

## 🧪 **Testing Steps**

1. **Test API Endpoint**:
   ```bash
   # Start server
   python manage.py runserver
   
   # Visit in browser:
   http://127.0.0.1:8000/api/catalog/products/
   ```
   You should see JSON array of products.

2. **Test Filters**:
   ```
   http://127.0.0.1:8000/api/catalog/products/?category=vegetables
   http://127.0.0.1:8000/api/catalog/products/?season=summer
   http://127.0.0.1:8000/api/catalog/products/?in_stock=true
   http://127.0.0.1:8000/api/catalog/products/?search=tomato
   ```

3. **Test Frontend**:
   - Visit catalog page
   - Open browser console (F12)
   - Check for: `"Loaded X products from backend"`
   - Verify products render correctly
   - Test filters, search, sorting
   - Test add to cart functionality

---

## 📊 **Data Flow Diagram**

```
┌─────────────┐
│  Database   │
│  (Product)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ ProductCatalogSerializer │  ← Transforms data
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ catalog_products_api │  ← API View
│    (views.py)       │
└──────┬──────────────┘
       │
       ▼ (JSON)
┌─────────────────────┐
│    Frontend         │
│   (script.js)       │  ← fetch('/api/catalog/products/')
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  UI Rendering       │  ← Same code as before!
│  (No changes!)      │
└─────────────────────┘
```

---

## 💡 **Important Notes**

1. **No UI Changes**: The catalog page UI/UX remains exactly the same
2. **Seamless Integration**: Frontend code mostly unchanged (just data source)
3. **Filter Compatibility**: Season format conversion handled automatically
4. **Error Handling**: Add proper error states for production
5. **Performance**: Consider pagination for large product lists
6. **CORS**: If needed, add `django-cors-headers` for API access

---

## 🚀 **Quick Start Commands**

```bash
# 1. Make sure you have products in database
python manage.py populate_products

# 2. Run migrations (if any changes)
python manage.py makemigrations
python manage.py migrate

# 3. Start server
python manage.py runserver

# 4. Test API
curl http://127.0.0.1:8000/api/catalog/products/

# 5. Open catalog page and check console
# Visit: http://127.0.0.1:8000/catalog/
```

---

## ❓ **Troubleshooting**

### Issue: Products not loading
**Solution**: Check browser console for fetch errors. Verify API endpoint is accessible.

### Issue: Season filter not working
**Solution**: The serializer auto-converts `SUMMER` → `summer`. Check database has correct season values.

### Issue: Images not showing
**Solution**: Verify image paths in database match your static files structure.

### Issue: Stock status always false
**Solution**: Ensure Inventory records exist for products with `stock_available > 0`.

---

## 📝 **Next Steps**

After completing these changes:
1. ✅ Test all filters work correctly
2. ✅ Test add to cart functionality  
3. ✅ Test search and sorting
4. ✅ Verify image loading
5. 🔄 Consider adding pagination for performance
6. 🔄 Add cart persistence (localStorage + backend sync)

---

**Need help with any of these files?** Let me know which one to modify next! 🎯
