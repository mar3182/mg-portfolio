// Blog posts data - in production, this could come from a CMS or markdown files
export const blogPosts = [
  {
    id: 1,
    slug: "building-modern-web-applications-with-react",
    title: "Building Modern Web Applications with React",
    excerpt: "Exploring the latest patterns and best practices for creating performant, scalable React applications in 2025.",
    content: `# Building Modern Web Applications with React

In the rapidly evolving landscape of web development, React continues to be a dominant force for building user interfaces. As we progress through 2025, new patterns and best practices have emerged that help developers create more performant, maintainable, and scalable applications.

## The Modern React Stack

Today's React applications benefit from a carefully chosen technology stack:

### Core Technologies
- **React 19**: Latest features including concurrent rendering and improved Suspense
- **Vite**: Lightning-fast build tool with excellent developer experience
- **TypeScript**: Type safety and better developer tooling
- **Framer Motion**: Smooth animations and micro-interactions

### Performance Considerations
Performance remains crucial for user experience and SEO. Key strategies include:

1. **Code Splitting**: Lazy load components and routes
2. **Bundle Optimization**: Tree shaking and dynamic imports
3. **Image Optimization**: Progressive loading and modern formats
4. **Core Web Vitals**: Focus on LCP, CLS, and FID metrics

## Real-World Implementation

In my recent portfolio project, I implemented several modern React patterns:

\`\`\`jsx
// Lazy loading with Suspense
const Projects = lazy(() => import('./pages/Projects'))

// Custom hooks for reusable logic
const useScrollReveal = () => {
  // Animation logic
}

// Performance-conscious component design
const ProjectCard = memo(({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Card content */}
    </motion.div>
  )
})
\`\`\`

## Best Practices for 2025

### 1. Component Architecture
- Keep components small and focused
- Use composition over inheritance
- Implement proper error boundaries

### 2. State Management
- Use React's built-in state for simple cases
- Consider Zustand or Jotai for complex state
- Avoid prop drilling with Context API

### 3. Performance Optimization
- Implement proper memoization strategies
- Use React DevTools Profiler
- Monitor Core Web Vitals in production

## Conclusion

Modern React development is about finding the right balance between functionality, performance, and developer experience. By leveraging the latest tools and following established patterns, we can build applications that delight users while maintaining clean, scalable code.

The key is to stay updated with the ecosystem while being selective about which new technologies to adopt. Focus on solving real problems rather than chasing the latest trends.`,
    author: "Mary Garcia",
    publishedAt: "2025-01-15",
    updatedAt: "2025-01-15",
    categories: ["React", "Web Development", "Performance"],
    tags: ["javascript", "react", "vite", "performance", "frontend"],
    readingTime: "8 min read",
    featured: true,
    seo: {
      metaDescription: "Learn modern React development patterns and best practices for building performant web applications in 2025.",
      keywords: ["React", "JavaScript", "Web Development", "Performance", "Frontend", "Modern Web Apps"]
    }
  },
  {
    id: 2,
    slug: "ai-integration-in-modern-development",
    title: "AI Integration in Modern Development Workflows",
    excerpt: "How artificial intelligence and machine learning are transforming the way we build and optimize web applications.",
    content: `# AI Integration in Modern Development Workflows

Artificial Intelligence is no longer a futuristic concept—it's actively transforming how we approach web development, from code generation to performance optimization and user experience enhancement.

## AI in Development Tools

### Code Generation and Assistance
Modern AI tools are becoming indispensable for developers:

- **GitHub Copilot**: Context-aware code suggestions
- **ChatGPT/Claude**: Architecture planning and problem-solving
- **Tabnine**: Intelligent code completion
- **Cursor**: AI-powered IDE experience

### Automated Testing and QA
AI is revolutionizing quality assurance:

\`\`\`javascript
// AI-generated test cases
describe('User Authentication', () => {
  it('should handle invalid credentials gracefully', async () => {
    // AI can generate comprehensive test scenarios
    const response = await loginUser({
      email: 'invalid@example.com',
      password: 'wrongpassword'
    })
    
    expect(response.status).toBe(401)
    expect(response.error).toContain('Invalid credentials')
  })
})
\`\`\`

## Real-World Applications

### Performance Optimization
In my recent projects, I've leveraged AI for:

1. **Bundle Analysis**: AI-powered recommendations for code splitting
2. **Image Optimization**: Automatic format selection and compression
3. **Load Time Prediction**: ML models predicting user experience metrics

### User Experience Enhancement
AI enables more personalized experiences:

- **Content Personalization**: Tailored project recommendations
- **Accessibility Improvements**: Automated alt-text generation
- **Performance Monitoring**: Predictive analytics for Core Web Vitals

## Implementation Strategies

### 1. Start Small
Begin with AI-assisted coding rather than full automation:

\`\`\`typescript
// AI-suggested optimization
const optimizedComponent = useMemo(() => {
  return expensiveCalculation(props.data)
}, [props.data])
\`\`\`

### 2. Focus on Developer Experience
Use AI to eliminate repetitive tasks:

- Automated component scaffolding
- Smart import suggestions
- Code refactoring assistance

### 3. Quality Gates
Implement AI-powered quality checks:

- Automated code reviews
- Performance regression detection
- Accessibility compliance scanning

## Future Considerations

### Ethical AI Development
- Ensure AI suggestions align with best practices
- Maintain code ownership and understanding
- Regular review of AI-generated code

### Performance Impact
- Monitor the overhead of AI-powered tools
- Balance automation with performance
- Consider offline capabilities

## Conclusion

AI integration in development workflows is about augmentation, not replacement. The most successful implementations enhance human creativity and efficiency while maintaining code quality and performance standards.

The key is thoughtful integration—using AI where it adds value while preserving the craft and intentionality that makes great software.`,
    author: "Mary Garcia",
    publishedAt: "2024-12-20",
    updatedAt: "2024-12-20",
    categories: ["AI", "Development", "Productivity"],
    tags: ["ai", "machine-learning", "automation", "development-tools", "workflow"],
    readingTime: "7 min read",
    featured: true,
    seo: {
      metaDescription: "Discover how AI and machine learning are transforming modern development workflows and enhancing productivity.",
      keywords: ["AI", "Machine Learning", "Development Tools", "Automation", "Productivity", "Web Development"]
    }
  },
  {
    id: 3,
    slug: "php-microservices-architecture-guide",
    title: "PHP Microservices Architecture: A Comprehensive Guide",
    excerpt: "Building scalable microservices with PHP, exploring patterns, tools, and best practices for enterprise-grade applications.",
    content: `# PHP Microservices Architecture: A Comprehensive Guide

With over 11 years of PHP experience, I've witnessed the evolution from monolithic applications to sophisticated microservices architectures. Here's a comprehensive guide to building scalable PHP microservices.

## Why PHP for Microservices?

Despite common misconceptions, PHP is excellent for microservices when properly architected:

### Advantages
- **Rapid Development**: Quick prototyping and iteration
- **Mature Ecosystem**: Extensive libraries and frameworks
- **Cost Effective**: Lower hosting costs and resource requirements
- **Developer Talent**: Large pool of experienced developers

### Modern PHP Stack
- **PHP 8.3+**: Latest language features and performance improvements
- **Symfony/Laravel**: Robust frameworks with microservice support
- **ReactPHP**: Asynchronous programming capabilities
- **Docker**: Containerization for scalability

## Architecture Patterns

### 1. API Gateway Pattern

\`\`\`php
<?php
// API Gateway with Symfony
class ApiGatewayController extends AbstractController
{
    private ServiceRegistry $serviceRegistry;
    private HttpClientInterface $httpClient;

    public function route(Request $request): JsonResponse
    {
        $service = $this->serviceRegistry->findService($request->getPathInfo());
        
        $response = $this->httpClient->request(
            $request->getMethod(),
            $service->getUrl() . $request->getPathInfo(),
            [
                'headers' => $request->headers->all(),
                'body' => $request->getContent()
            ]
        );

        return new JsonResponse(
            $response->getContent(),
            $response->getStatusCode()
        );
    }
}
\`\`\`

### 2. Event-Driven Architecture

\`\`\`php
<?php
// Event publishing with RabbitMQ
class UserRegistrationService
{
    private EventDispatcher $eventDispatcher;

    public function registerUser(array $userData): User
    {
        $user = User::create($userData);
        
        // Publish event for other services
        $this->eventDispatcher->dispatch(new UserRegisteredEvent($user));
        
        return $user;
    }
}

class UserRegisteredEvent
{
    public function __construct(
        private User $user
    ) {}

    public function getUser(): User
    {
        return $this->user;
    }
}
\`\`\`

## Service Communication

### Synchronous Communication
For immediate responses and strong consistency:

\`\`\`php
<?php
// HTTP client for service-to-service communication
class PaymentService
{
    private HttpClientInterface $httpClient;

    public function processPayment(int $orderId, float $amount): PaymentResult
    {
        $response = $this->httpClient->request('POST', 
            'http://order-service/api/orders/' . $orderId . '/validate',
            ['json' => ['amount' => $amount]]
        );

        if ($response->getStatusCode() === 200) {
            // Process payment
            return $this->chargeCard($amount);
        }

        throw new InvalidOrderException('Order validation failed');
    }
}
\`\`\`

### Asynchronous Communication
For eventual consistency and better performance:

\`\`\`php
<?php
// Message queue consumer
class OrderProcessor
{
    public function handleOrderCreated(OrderCreatedMessage $message): void
    {
        $order = $this->orderRepository->find($message->getOrderId());
        
        // Process inventory
        $this->inventoryService->reserveItems($order->getItems());
        
        // Send confirmation email
        $this->emailService->sendOrderConfirmation($order);
        
        // Publish completion event
        $this->messagePublisher->publish(
            new OrderProcessedMessage($order->getId())
        );
    }
}
\`\`\`

## Data Management

### Database Per Service
Each microservice should own its data:

\`\`\`php
<?php
// User service with its own database
class UserService
{
    private EntityManagerInterface $entityManager;

    public function createUser(CreateUserRequest $request): User
    {
        $user = new User(
            $request->getEmail(),
            $request->getName(),
            $this->passwordHasher->hash($request->getPassword())
        );

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }
}
\`\`\`

### CQRS Pattern
Separate read and write models:

\`\`\`php
<?php
// Command handler for writes
class CreateOrderCommandHandler
{
    public function handle(CreateOrderCommand $command): void
    {
        $order = Order::create(
            $command->getCustomerId(),
            $command->getItems(),
            $command->getShippingAddress()
        );

        $this->orderRepository->save($order);
        
        // Project to read model
        $this->projectionBus->dispatch(
            new ProjectOrderCommand($order)
        );
    }
}

// Query handler for reads
class OrderQueryHandler
{
    public function getOrdersByCustomer(int $customerId): array
    {
        return $this->readModelRepository->findOrdersByCustomer($customerId);
    }
}
\`\`\`

## Deployment and DevOps

### Docker Configuration

\`\`\`dockerfile
FROM php:8.3-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    nginx \
    postgresql-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql opcache

# Copy application
COPY . /var/www/html

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader

EXPOSE 80
CMD ["php-fpm"]
\`\`\`

### Kubernetes Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 80
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: user-service-secret
              key: database-url
\`\`\`

## Monitoring and Observability

### Health Checks

\`\`\`php
<?php
class HealthController extends AbstractController
{
    public function health(): JsonResponse
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'redis' => $this->checkRedis(),
            'external_api' => $this->checkExternalApi()
        ];

        $status = array_reduce($checks, fn($carry, $check) => 
            $carry && $check['status'] === 'ok', true
        ) ? 'healthy' : 'unhealthy';

        return new JsonResponse([
            'status' => $status,
            'checks' => $checks,
            'timestamp' => time()
        ]);
    }
}
\`\`\`

### Distributed Tracing

\`\`\`php
<?php
use OpenTelemetry\\API\\Trace\\Tracer;

class OrderController
{
    private Tracer $tracer;

    public function createOrder(Request $request): JsonResponse
    {
        $span = $this->tracer->spanBuilder('create_order')->startSpan();
        
        try {
            $order = $this->orderService->createOrder($request->toArray());
            $span->setStatus(StatusCode::STATUS_OK);
            
            return new JsonResponse($order->toArray(), 201);
        } catch (Exception $e) {
            $span->recordException($e);
            $span->setStatus(StatusCode::STATUS_ERROR);
            throw $e;
        } finally {
            $span->end();
        }
    }
}
\`\`\`

## Best Practices

### 1. Service Design
- Single Responsibility Principle
- Domain-driven design
- API versioning strategy
- Backward compatibility

### 2. Security
- JWT-based authentication
- Service-to-service TLS
- Input validation and sanitization
- Rate limiting and throttling

### 3. Performance
- Connection pooling
- Caching strategies
- Asynchronous processing
- Circuit breaker pattern

## Conclusion

PHP microservices architecture, when properly implemented, provides excellent scalability, maintainability, and performance. The key is choosing the right patterns for your specific use case and maintaining consistency across services.

Success comes from starting small, iterating quickly, and building robust monitoring and deployment pipelines from day one.`,
    author: "Mary Garcia",
    publishedAt: "2024-11-30",
    updatedAt: "2024-11-30",
    categories: ["PHP", "Architecture", "Backend"],
    tags: ["php", "microservices", "architecture", "symfony", "backend", "scalability"],
    readingTime: "12 min read",
    featured: false,
    seo: {
      metaDescription: "Complete guide to building scalable PHP microservices architecture with modern patterns and best practices.",
      keywords: ["PHP", "Microservices", "Architecture", "Symfony", "Backend Development", "Scalability"]
    }
  }
]

// Blog categories for filtering
export const blogCategories = [
  "All",
  "React",
  "PHP", 
  "AI",
  "Web Development",
  "Architecture",
  "Performance",
  "Backend",
  "Development",
  "Productivity"
]

// Get featured posts
export const getFeaturedPosts = () => blogPosts.filter(post => post.featured)

// Get posts by category
export const getPostsByCategory = (category) => {
  if (category === "All") return blogPosts
  return blogPosts.filter(post => post.categories.includes(category))
}

// Get post by slug
export const getPostBySlug = (slug) => blogPosts.find(post => post.slug === slug)

// Get recent posts
export const getRecentPosts = (limit = 5) => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit)
}

// Search posts
export const searchPosts = (query) => {
  const searchTerm = query.toLowerCase()
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}