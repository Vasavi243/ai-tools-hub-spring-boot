# AI Tools Hub - Modern Spring Boot & MySQL Web Application

AI Tools Hub is a full-stack, production-grade web application designed to discover, filter, search, and manage state-of-the-art Artificial Intelligence tools. Built with **Java 21**, **Spring Boot 3**, **Spring Data JPA**, **MySQL**, and a responsive **Bootstrap 5 + JavaScript** frontend.

---

## 🌟 Key Features

### User Capabilities
- 🔍 **Real-Time Instant Search**: Fast, debounced search across AI tool names, descriptions, categories, and feature keywords.
- 🏷️ **Category Filtering**: Explore curated categories: *Coding, Research, Writing, Design, Education, Video, Image Generation, Productivity, Marketing, Chatbots*.
- 💰 **Pricing Filter**: Filter tools by *Free*, *Freemium*, or *Paid* tiers.
- 📖 **Tool Details Modal**: View comprehensive descriptions, launch dates, category tags, and feature breakdowns.
- 🌐 **Direct Website Access**: One-click outbound launch to official AI tool platforms.

### Admin Dashboard Capabilities
- 📊 **Real-Time Analytics & Statistics**: Track total tool counts, category breakdown metrics, and pricing distribution.
- ➕ **Add New AI Tool**: Create new entries with input validation and field checks.
- ✏️ **Update Tool**: Edit tool metadata, URLs, categories, descriptions, and feature lists.
- 🗑️ **Delete Tool**: Safe confirmation modal to remove entries from MySQL database.
- 📋 **Admin Table Filter**: Dedicated quick search for inventory management.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend Framework** | Java 21 LTS, Spring Boot 3.2.3, Spring Web |
| **Data Persistence** | Spring Data JPA, Hibernate ORM |
| **Database** | MySQL Server 8.0+ |
| **Validation** | Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`, `@URL`) |
| **Exception Handling** | `@RestControllerAdvice`, `GlobalExceptionHandler` |
| **Frontend UI** | HTML5, CSS3 (Glassmorphism Dark System), JavaScript (ES6 Fetch API), Bootstrap 5.3, FontAwesome |

> **Note:** Strictly follows clean architecture without using JSP, Servlets, or raw JDBC.

---

## 📐 Layered Architecture

```text
Controller (ToolController)
     │
     ▼
  Service (ToolService)
     │
     ▼
Repository (ToolRepository)
     │
     ▼
  Entity (Tool)
     │
     ▼
MySQL Database (aitoolshub)
```

---

## 📂 Project Directory Structure

```text
c:\Users\vasav\OneDrive\Desktop\springboot\
├── pom.xml
├── README.md
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── aitoolshub/
        │           ├── AIToolsHubApplication.java
        │           ├── config/
        │           │   └── DataInitializer.java
        │           ├── controller/
        │           │   └── ToolController.java
        │           ├── exception/
        │           │   ├── ErrorResponse.java
        │           │   ├── GlobalExceptionHandler.java
        │           │   └── ResourceNotFoundException.java
        │           ├── model/
        │           │   └── Tool.java
        │           ├── repository/
        │           │   └── ToolRepository.java
        │           └── service/
        │               └── ToolService.java
        └── resources/
            ├── application.properties
            └── static/
                ├── css/
                │   └── styles.css
                ├── js/
                │   └── app.js
                └── index.html
```

---

## 🚀 REST API Reference

All API endpoints return standard JSON responses with appropriate HTTP status codes (`200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`).

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tools` | Fetch all AI tools | `200 OK` |
| `GET` | `/api/tools/{id}` | Fetch tool by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/tools` | Create new AI tool | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/tools/{id}` | Update existing AI tool | `200 OK` / `404 Not Found` / `400 Bad Request` |
| `DELETE` | `/api/tools/{id}` | Delete tool by ID | `204 No Content` / `404 Not Found` |
| `GET` | `/api/tools/search?keyword={query}` | Search tools by keyword | `200 OK` |
| `GET` | `/api/tools/category/{category}` | Filter tools by category | `200 OK` |
| `GET` | `/api/tools/stats` | Summary metrics & stats | `200 OK` |

---

## ⚙️ MySQL Setup & Configuration

1. **Install and start MySQL Server** (e.g. via MySQL Workbench, Command Line, or XAMPP).
2. Create the database manually (or let Spring Boot create it automatically via `createDatabaseIfNotExist=true`):
   ```sql
   CREATE DATABASE IF NOT EXISTS aitoolshub;
   ```
3. Open `src/main/resources/application.properties` and verify your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/aitoolshub?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root
   ```
4. On initial boot, `DataInitializer.java` will automatically pre-populate the database with 12+ popular AI tools (ChatGPT, Midjourney, Copilot, Claude 3, Runway, etc.) if the table is empty!

---

## 🏃 Running the Application

### Using Maven Command
Navigate to the root directory:
```bash
mvn clean spring-boot:run
```

Once started, open your web browser and navigate to:
```text
http://localhost:8080
```

---

## 🧪 Sample cURL Commands

### 1. Create a New Tool
```bash
curl -X POST http://localhost:8080/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Devin AI",
    "description": "Autonomous AI software engineer capable of building and deploying end-to-end applications.",
    "category": "Coding",
    "url": "https://cognition-labs.com",
    "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    "pricing": "Paid",
    "features": "Autonomous Coding, Bug Fixing, End-to-end Deployment"
  }'
```

### 2. Search Tools
```bash
curl http://localhost:8080/api/tools/search?keyword=code
```

### 3. Get Category Statistics
```bash
curl http://localhost:8080/api/tools/stats
```
