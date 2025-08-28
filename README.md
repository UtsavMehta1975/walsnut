# Walnut - Premium Watch E-commerce Platform

A modern, responsive e-commerce website for premium homage timepieces, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌟 Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse watches with filtering and search
- **Shopping Cart**: Add items with real-time updates
- **User Authentication**: Secure sign-up/sign-in with NextAuth.js
- **Order Management**: Track orders and view history
- **Wishlist**: Save favorite watches for later

### 🎨 Design & UX
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, minimalist design with walnut-themed aesthetics
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: WCAG compliant components

### 🔧 Technical Features
- **Next.js 14**: App Router with Server and Client Components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system
- **Prisma ORM**: Database management with MySQL
- **NextAuth.js**: Authentication and session management
- **Zustand**: Lightweight state management for cart
- **Image Optimization**: Next.js Image component with fallbacks

### 🛡️ Security & Performance
- **Authentication**: Secure user sessions and role-based access
- **API Protection**: Middleware for route protection
- **Image Optimization**: Automatic optimization and lazy loading
- **SEO Optimized**: Meta tags and structured data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/UtsavMehta1975/walsnut.git
   cd walsnut
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   # Database
   MYSQL_URL="mysql://username:password@localhost:3306/walnut_db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Additional configurations
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
walsnut/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin panel
│   ├── watches/           # Product pages
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order management
│   └── ...                # Other pages
├── components/            # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   └── home/             # Homepage components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🎯 Key Pages

### Public Pages
- **Homepage**: Featured products and brand introduction
- **Watches**: Product catalog with filtering
- **Product Details**: Individual watch pages
- **About**: Company information
- **Contact**: Contact form and information
- **Legal Pages**: Privacy, Terms, Refund policies

### User Pages (Authenticated)
- **Account**: User profile management
- **Orders**: Order history and tracking
- **Wishlist**: Saved favorite watches
- **Cart**: Shopping cart management

### Admin Pages
- **Admin Panel**: Product management, orders, analytics
- **Image Management**: Upload and manage product images

## 🔐 Authentication

The application uses NextAuth.js with the following features:
- Email/password authentication
- Session management
- Role-based access control (User/Admin)
- Protected routes with middleware

## 🛒 Shopping Features

- **Product Catalog**: Browse with filters (brand, condition, price)
- **Search**: Real-time search functionality
- **Cart Management**: Add/remove items, quantity updates
- **Checkout**: Streamlined checkout process
- **Order Tracking**: View order status and history

## 📱 Responsive Design

The website is fully responsive with:
- Mobile-first approach
- Touch-friendly interfaces
- Optimized layouts for all screen sizes
- Fast loading on mobile networks

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@walnut.com or visit our [support page](/support).

## 🔗 Links

- **Website**: [walnut.com](https://walnut.com)
- **Documentation**: [docs.walnut.com](https://docs.walnut.com)
- **Support**: [support.walnut.com](https://support.walnut.com)

---

Built with ❤️ by the Walnut team

