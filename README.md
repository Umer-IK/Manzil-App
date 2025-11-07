**# Manzil - Sprint 3**

## **Project Overview**  
**Manzil** is a **React Native Expo** application designed to help tourists with:  
- **Planning trips using AI**
- **Reserving hotel rooms**  
- **Checking for car rental companies & renting cars**  
- **Checking reviews for tourist spots**  
- **Leaving reviews for places they visit**  
- **Exploring food options based on location**  

## **Sprint 3 Updates**  
In **Sprint 3**, we have introduced the following enhancements:  

### **1. Data Scraping for Car Rentals & Restaurants**  
- Scraped real-time data for car rental services and food options (restaurants) based on the user’s selected location.  
- Users can explore and navigate to these locations directly from the app.  
- Integrated user reviews for both car rentals and restaurants.  

### **2. AI-Powered Trip Planner**  
- Users can enter their **destination** and **pickup location**.
- An **AI-powered trip planner** generates an optimized trip itinerary.  
- Users can either **save the plan** or **regenerate a new one**.  

### **3. Enhanced Navigation & Reviews**  
- Integrated navigation support for the newly added **car rentals and food locations**.
- Users can read and submit reviews for car rental companies and restaurants.
  
## **How to Run the Application Locally**  

### **For the Mobile App (Customer Side)**  
1. **Go to the project root directory**  
2. Run:  
   ```sh
   npm install
   npm start
   ```  
3. Scan the QR code in the **Expo Go App**.  
4. The app will run in **Expo Go**.  

### **For the Hotel Admin Panel (Web Application)**  
1. The hotel admin panel is available in a **separate repository**.  
2. The files are also uploaded in this repository.  
3. **To run it locally:**  
   ```sh
   npm install
   npm start
   ```  
4. **Login with hotel credentials (Example):**  
   - **Email:** `pc.admin@pc.com`  
   - **Password:** `pcadminpass123`  
   - Hotel admin credentials are provided manually.  

## **Live Deployment**  
The **Hotel Admin Panel** is available at:  
[Hotel Admin Web Panel](http://myexpoapp-hoteladmin.s3-website-us-east-1.amazonaws.com/)  

## **User Authentication**  
- **Signup feature** is available for users.  
- **Hotel Admin credentials** are provided manually.  

## **Tech Stack**  
- **Frontend:** React Native (Expo), React (for Web Panel)  
- **Backend:** Hosted on **AWS** (No need to run separately)  
- **Database & APIs:** MongoDB Integrated with AWS backend  
- **AI Integration:** AI-powered trip planner API  

---  

## **Future Plans**  
We are working on integrating our **own car renting system** by onboarding individual riders.  
- Users will be able to request a ride.
- Available riders will receive the offer based on their availability.  

