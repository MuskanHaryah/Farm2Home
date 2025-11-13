"""
Test script for authentication APIs
Run this after starting the Django server with: python manage.py runserver
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_login_api():
    """Test the login API endpoint"""
    print("\n" + "="*60)
    print("TESTING LOGIN API")
    print("="*60)
    
    # Test with existing customer (should have been populated)
    login_data = {
        "email": "john.doe@example.com",  # Adjust this email based on your customer data
        "password": "user123"
    }
    
    print(f"\n1. Testing Login with: {login_data['email']}")
    response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("✓ Login Successful!")
        return response.json().get('customer_id')
    else:
        print("✗ Login Failed!")
        return None


def test_login_api_wrong_password():
    """Test login with wrong password"""
    print("\n2. Testing Login with WRONG password")
    login_data = {
        "email": "john.doe@example.com",
        "password": "wrongpassword"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 401:
        print("✓ Correctly rejected wrong password!")
    else:
        print("✗ Should have rejected wrong password!")


def test_login_api_missing_fields():
    """Test login with missing fields"""
    print("\n3. Testing Login with MISSING fields")
    login_data = {
        "email": "john.doe@example.com"
        # password missing
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 400:
        print("✓ Correctly rejected missing fields!")
    else:
        print("✗ Should have rejected missing fields!")


def test_signup_api():
    """Test the signup API endpoint"""
    print("\n" + "="*60)
    print("TESTING SIGNUP API")
    print("="*60)
    
    # Test creating a new customer
    signup_data = {
        "name": "Test User",
        "email": f"testuser{requests.get(f'{BASE_URL}/api/customers/').json()}@example.com",  # Unique email
        "phone": "9876543210",
        "address": "456 Test Street, Test City",
        "password": "test123"
    }
    
    print(f"\n1. Testing Signup with new user")
    response = requests.post(f"{BASE_URL}/api/auth/signup/", json=signup_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("✓ Signup Successful!")
        return response.json().get('customer_id')
    else:
        print("✗ Signup Failed!")
        return None


def test_signup_api_duplicate_email():
    """Test signup with duplicate email"""
    print("\n2. Testing Signup with DUPLICATE email")
    signup_data = {
        "name": "Another User",
        "email": "john.doe@example.com",  # Already exists
        "phone": "1111111111",
        "address": "789 Duplicate St",
        "password": "test123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/signup/", json=signup_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 409:
        print("✓ Correctly rejected duplicate email!")
    else:
        print("✗ Should have rejected duplicate email!")


def test_signup_api_short_password():
    """Test signup with short password"""
    print("\n3. Testing Signup with SHORT password")
    signup_data = {
        "name": "Test User 2",
        "email": "testuser2@example.com",
        "phone": "2222222222",
        "address": "123 Short Pass St",
        "password": "123"  # Too short
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/signup/", json=signup_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 400:
        print("✓ Correctly rejected short password!")
    else:
        print("✗ Should have rejected short password!")


def test_complete_flow():
    """Test complete authentication flow"""
    print("\n" + "="*60)
    print("TESTING COMPLETE AUTHENTICATION FLOW")
    print("="*60)
    
    # 1. Signup new user
    print("\n1. Creating new account...")
    import random
    signup_data = {
        "name": "Flow Test User",
        "email": f"flowtest{random.randint(1000, 9999)}@example.com",
        "phone": "5555555555",
        "address": "123 Flow Test Road",
        "password": "flowtest123"
    }
    
    signup_response = requests.post(f"{BASE_URL}/api/auth/signup/", json=signup_data)
    print(f"Signup Status: {signup_response.status_code}")
    
    if signup_response.status_code == 201:
        print("✓ Account created successfully!")
        customer_id = signup_response.json().get('customer_id')
        
        # 2. Login with the new account
        print("\n2. Logging in with new account...")
        login_data = {
            "email": signup_data['email'],
            "password": signup_data['password']
        }
        
        login_response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
        print(f"Login Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            print("✓ Login successful!")
            print(f"✓ Complete flow works! Customer ID: {customer_id}")
        else:
            print("✗ Login failed after signup!")
    else:
        print("✗ Signup failed!")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("AUTHENTICATION API TEST SUITE")
    print("="*60)
    print("\nMake sure Django server is running on http://127.0.0.1:8000")
    print("Run: python manage.py runserver")
    input("\nPress Enter when server is ready...")
    
    try:
        # Test Login API
        test_login_api()
        test_login_api_wrong_password()
        test_login_api_missing_fields()
        
        # Test Signup API
        test_signup_api()
        test_signup_api_duplicate_email()
        test_signup_api_short_password()
        
        # Test complete flow
        test_complete_flow()
        
        print("\n" + "="*60)
        print("ALL TESTS COMPLETED!")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n✗ ERROR: Could not connect to Django server!")
        print("Make sure the server is running: python manage.py runserver")
    except Exception as e:
        print(f"\n✗ ERROR: {str(e)}")
