// 사용자
export interface User {
  id: number;
  email: string;
  username: string;
  phone?: string;
  profile_image?: string;
  role: 'admin' | 'instructor' | 'member' | 'pending';
  role_display?: string;
  requested_role: 'instructor' | 'member';
  requested_role_display?: string;
  is_approved: boolean;
  is_active?: boolean;
  is_email_verified?: boolean;
  social_provider?: string | null;
  created_at: string;
  wants_club_membership?: boolean;
  assigned_club?: number | null;
  assigned_club_name?: string | null;
}

// 인증
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  password2: string;
  phone?: string;
}

// 게시판
export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  views: number;
  is_public: boolean;
  images: PostImage[];
  comments: Comment[];
  thumbnail?: string;
  comment_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PostImage {
  id: number;
  image: string;
  created_at: string;
}

export interface Comment {
  id: number;
  author: User;
  content: string;
  created_at: string;
  updated_at: string;
}

// 갤러리
export interface Album {
  id: number;
  title: string;
  description: string;
  cover_image?: string;
  author: User;
  album_type: 'public' | 'member';
  is_public: boolean;
  is_hidden: boolean;
  photos: Photo[];
  photo_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: number;
  image: string;
  caption: string;
  is_hidden: boolean;
  created_at: string;
}

// 공지사항
export interface Notice {
  id: number;
  title: string;
  content: string;
  author: User;
  visibility: 'public' | 'member' | 'club';
  visibility_display?: string;
  is_important: boolean;
  is_hidden: boolean;
  views: number;
  club?: number | null;
  club_name?: string | null;
  created_at: string;
  updated_at: string;
}

// 일정
export interface Event {
  id: number;
  title: string;
  description: string;
  event_type: 'match' | 'tournament' | 'practice' | 'meeting' | 'other';
  location: string;
  location_link: string;
  start_date: string;
  end_date: string;
  max_participants: number;
  participants: EventParticipant[];
  participant_count?: number;
  is_participating?: boolean;
  created_by: User;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: number;
  user: User;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

// 메신저
export interface ChatRoom {
  id: number;
  name: string;
  description: string;
  icon?: string | null;
  is_group: boolean;
  is_public: boolean;
  created_by?: User;
  members: User[];
  messages?: Message[];
  last_message?: {
    content: string;
    sender: string;
    created_at: string;
  };
  unread_count?: number;
  member_count?: number;
  can_manage?: boolean;
  notification_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  sender: User;
  content: string;
  is_read: boolean;
  created_at: string;
}

// API 응답
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// 협회소개 콘텐츠
export interface AboutContent {
  greeting_text: string;
  greeting_author: string;
  greeting_image: string | null;
  updated_at: string;
}

// 협회 임원
export interface Executive {
  id: number;
  name: string;
  phone: string;
  greeting: string;
  photo: string | null;
  order: number;
  created_at: string;
}

// 배너
export interface Banner {
  id: number;
  image: string;
  phone_number: string;
  description: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

// 유관기관
export interface Organization {
  id: number;
  name: string;
  logo: string;
  link: string;
  order: number;
  is_active: boolean;
}
