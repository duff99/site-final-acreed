import type {
  Job,
  CreateJobInput,
  UpdateJobInput,
  LoginInput,
  AuthResponse,
  AdminUser,
  CreateAdminInput,
  UpdateAdminInput,
  CreateApplicationInput,
  ChangePasswordInput,
  ContactMessage,
  UpdateContactMessageInput,
  Application,
  UpdateApplicationInput,
} from '@shared/types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private accessToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private static readonly REQUEST_TIMEOUT = 30_000; // 30 seconds

  setToken(token: string | null) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken;
  }

  private fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ApiClient.REQUEST_TIMEOUT);
    return fetch(url, { ...options, signal: controller.signal }).finally(() =>
      clearTimeout(timeout)
    );
  }

  private async refreshAccessToken(): Promise<string | null> {
    // Mutex: reuse in-flight refresh to avoid race conditions
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const res = await this.fetchWithTimeout(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) return null;
        const data = await res.json();
        this.accessToken = data.accessToken;
        return data.accessToken as string;
      } catch {
        return null;
      }
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const res = await this.fetchWithTimeout(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (res.status === 401 && this.accessToken) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        const retry = await this.fetchWithTimeout(`${API_BASE}${path}`, {
          ...options,
          headers,
          credentials: 'include',
        });
        if (!retry.ok) throw new Error((await retry.json()).message);
        return retry.json();
      }
      // Refresh failed — force logout
      this.accessToken = null;
      window.location.href = '/admin/login';
      throw new Error('Session expiree');
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Erreur inconnue' }));
      throw new Error(error.message);
    }

    return res.json();
  }

  // Public
  getJobs(sector?: string) {
    const params = sector && sector !== 'Tous' ? `?sector=${encodeURIComponent(sector)}` : '';
    return this.request<Job[]>(`/jobs${params}`);
  }

  getJob(id: string) {
    return this.request<Job>(`/jobs/${id}`);
  }

  // Auth
  login(data: LoginInput) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  logout() {
    return this.request<{ message: string }>('/auth/logout', { method: 'POST' });
  }

  changePassword(data: ChangePasswordInput) {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin CRUD
  getAdminJobs() {
    return this.request<Job[]>('/admin/jobs');
  }

  getAdminJob(id: string) {
    return this.request<Job>(`/admin/jobs/${id}`);
  }

  createJob(data: CreateJobInput) {
    return this.request<Job>('/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateJob(id: string, data: UpdateJobInput) {
    return this.request<Job>(`/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  deleteJob(id: string) {
    return this.request<{ message: string }>(`/admin/jobs/${id}`, { method: 'DELETE' });
  }

  toggleJob(id: string) {
    return this.request<Job>(`/admin/jobs/${id}/toggle`, { method: 'PATCH' });
  }

  // Admin User Management
  getAdminUsers() {
    return this.request<AdminUser[]>('/admin/users');
  }

  getAdminUser(id: string) {
    return this.request<AdminUser>(`/admin/users/${id}`);
  }

  createAdmin(data: CreateAdminInput) {
    return this.request<AdminUser>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateAdmin(id: string, data: UpdateAdminInput) {
    return this.request<AdminUser>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  deleteAdmin(id: string) {
    return this.request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' });
  }

  getMe() {
    return this.request<AdminUser>('/auth/me');
  }

  // Public - Applications
  submitApplication(data: CreateApplicationInput & { website?: string }) {
    return this.request<{ message: string; id: string }>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin - Contact messages
  getAdminContactMessages() {
    return this.request<ContactMessage[]>('/admin/contact-messages');
  }

  getAdminContactMessage(id: string) {
    return this.request<ContactMessage>(`/admin/contact-messages/${id}`);
  }

  updateAdminContactMessage(id: string, data: UpdateContactMessageInput) {
    return this.request<ContactMessage>(`/admin/contact-messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteAdminContactMessage(id: string) {
    return this.request<{ message: string }>(`/admin/contact-messages/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Applications
  getAdminApplications() {
    return this.request<Application[]>('/admin/applications');
  }

  getAdminApplication(id: string) {
    return this.request<Application>(`/admin/applications/${id}`);
  }

  updateAdminApplication(id: string, data: UpdateApplicationInput) {
    return this.request<Application>(`/admin/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteAdminApplication(id: string) {
    return this.request<{ message: string }>(`/admin/applications/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
