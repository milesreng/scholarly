# scholarly

## Overview
This project is a secure web application designed to enhance collaboration on research projects at Duke University. The application provides a platform where students can create, join, and manage research groups and project teams, ensuring a streamlined and intuitive user experience.

## Technologies Used
Backend: Node.js, Express.js, MongoDB

Frontend: Vue.js

Deployment: Kubernetes

Authentication: OpenID Connect (OIDC), OAuth2

## Features
Scalable Deployment: The application is deployed on Kubernetes, utilizing a load balancer to ensure scalability and high availability across user sessions.
Secure Authentication: Integrated with OpenID Connect (OIDC) and OAuth2 to provide secure authentication, allowing students to manage their research projects and tasks securely.
Dynamic User Interface: Developed with Vue.js, the interface is designed to be user-friendly, enabling students to effortlessly navigate and interact with the platform.
Role-Based Access Control (RBAC): A comprehensive RBAC system is implemented, defining distinct user roles such as Admin, Member, and Viewer to enhance data security and maintain operational integrity.
