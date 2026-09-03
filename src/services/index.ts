// src/services/index.ts — Exports centralisés des services API

export { default as apiClient } from './api.client';
export { ENDPOINTS, API_CONFIG } from './config';
export { authService } from './auth.service';
export { scannerService } from './scanner.service';
export { restaurantsService } from './restaurants.service';
export { ordersService } from './orders.service';
export { paymentsService } from './payments.service';
export { eventsService } from './events.service';
export { coursesService } from './courses.service';
export { gamesService } from './games.service';
export { communityService } from './community.service';
export { usersService } from './users.service';
export { recipesService } from './recipes.service';
export { proService } from './pro.service';
export { socketService } from './socket.service';
export type { OrderStatusUpdate, EventChatMessage } from './socket.service';
