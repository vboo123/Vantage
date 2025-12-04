# Personalized Deal Manager (PDM) Requirements

## Feature Overview

| **Field** | **Description** |
| --- | --- |
| **Feature Name** | **Personalized Deal Manager (PDM)** |
| **Goal** | To automatically transform **private, personalized deals** received via email or text (the "clutter") into **active, actionable shopping intelligence** based on the user's item-specific preferences. |
| **Primary Value** | Eliminates the time spent manually sifting through and interpreting hundreds of promotional emails/texts. Ensures the user is alerted **only** when a relevant, active private deal matches their explicit shopping needs. |
| **Target User** | **Deal-Centric Shoppers**, **Re-sellers/Arbitrageurs**, **Long-term Planners**. |

## Problem Statement
Users sign up for retailer email/text lists to receive deals but suffer from promotional fatigue. They must manually sift through emails, interpret terms, cross-reference categories, and check stock. PDM reverses this by surfacing deals that match the user's specific intent.

## MVP Features

| **Feature Category** | **Feature Name** | **Description & Technical Focus** |
| --- | --- | --- |
| **Authentication & Access** | Gmail/Outlook OAuth Flow | Securely implement Google/Microsoft OAuth (read-only scope) to allow the app to access the user's Promotions and Inbox labels. Authentication handled by AWS Cognito. |
| **User Intent Capture** | **Item-Centric Shopping Watchlist** | A simple UI in the mobile app using React Native where the user can input and toggle active product categories (e.g., Black Jeans, Suit, Running Shoes). This list is stored in DynamoDB. |
| **Data Processing Core** | LLM Deal Parser (Agent) | A Python Lambda function uses an LLM to analyze email content and structure the data. Critical fields: Store Name, Discount Value/Terms, Coupon Code, **Applicable Item Category**, Purchase Threshold, Deal URL, Exclusions, Expiration Date. |
| **Recommendation & Display** | **Filtered Deal Feed** | A dedicated UI screen that only displays deals from the parsed emails that **match the user's active Shopping Watchlist items.** Ranked by highest effective discount value. |
| **Data Storage** | DynamoDB Deal Table | Stores the parsed and structured deal data (JSON objects) in a DynamoDB table, indexed by UserID and **Item Category**. |

## Technical Design: Data Flow (AWS Serverless)

| **Component** | **Technology** | **Rationale** |
| --- | --- | --- |
| **Front-end** | React Native | User interface, handles sign-in, and receives push notifications. |
| **Backend Logic** | Python (AWS Lambda) | Executes the parsing and storage logic only when a new email arrives. |
| **Database** | Amazon DynamoDB | Stores structured deal data and user watchlists. |
| **Authentication** | AWS Cognito | Manages user identity and secures all API endpoints. |
| **Real-Time Trigger** | Gmail Pub/Sub & AWS Lambda | Mechanism to instantly notify backend of new emails. |
| **Notification** | AWS SNS / FCM | Sends immediate push alerts to the React Native app. |
