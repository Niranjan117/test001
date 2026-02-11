# Solar Sense

## Overview

Solar Sense is a modern application designed to help users monitor the performance of their solar panel installations from Solax. It allows real-time tracking of energy production. The application also supports multiple languages and features a demo mode for users without a solar installation who wish to explore its capabilities.

## Features

-   **Real-time Solar Data Monitoring**: Access real-time data on energy production from your photovoltaic (PV) installation.

-   **Multi-Language Support**: Seamlessly switch between Polish and English for a localized user experience.

-   **Demo Mode**: Try the app in demo mode if you don’t have a solar installation, giving potential users a preview of the features.

-   **Responsive Design**: The app is fully responsive, ensuring an optimal experience on both desktop and mobile devices.

## Getting Started

To view the website online, visit [https://karolfaltyn.github.io/solar-sense/](https://karolfaltyn.github.io/solar-sense/).

### Prerequisites

1.  Activate api service in SolaX Cloud

2. Get TokenID and SN Number

     - More info available on [SolaxCloud_User_Monitoring_API_V6.1.pdf](https://www.solaxcloud.com/user_api/SolaxCloud_User_Monitoring_API_V6.1.pdf).


### Installation

Follow these steps to set up the Solar Sense App on your local machine:

1.  Clone the repository:
    
    ```bash
    git clone https://github.com/karolfaltyn/solar-sense.git
    ```
    
2.  Navigate to the project directory:
    
    ```bash
    cd solar-sense
	```    
3.  Install the necessary dependencies:
    
    ```bash
    npm install 
    ```
    
4.  Start the development server:
    
    ```bash
    npm run dev
    ```
5.  Open your browser and visit `http://localhost:5173` to access the application.

## Usage
1.  **Insert Data:**
     -   Enter your Token ID and SN Number to view details of your solar installation.
  
2.  **View Production Details:**
    
    -   Once the data is entered, the app will display the current photovoltaic production details.

## Technologies Used

-   **React**: For building the interactive user interface.

-   **TypeScript**: Ensures type safety and better code management.

-   **Tailwind CSS**: Utility-first CSS framework for responsive and customizable design.

-   **Radix UI**: Provides accessible and customizable UI components.

-   **API Integration**: Fetches data from photovoltaic systems.

-   **i18n (Internationalization)**: Provides multi-language support.

-   **PostCSS**: For processing and optimizing CSS.

## License

This project is licensed under the MIT License.
