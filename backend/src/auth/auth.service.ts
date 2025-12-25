import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async login(email: string, password: string) {
    // Validate inputs
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    if (!email.trim() || !password.trim()) {
      throw new UnauthorizedException('Email and password cannot be empty');
    }

    const supabase = this.supabaseService.getClient();
    
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError || !authData.user) {
      // Provide more detailed error message
      const errorMessage = authError?.message || 'Invalid credentials';
      
      // Check if it's a missing email/password error
      if (errorMessage.includes('missing email or phone')) {
        throw new UnauthorizedException(
          'Email and password are required. Please check your input and try again.'
        );
      }
      
      throw new UnauthorizedException(
        `Authentication failed: ${errorMessage}. Make sure the user exists in Supabase Auth and the password is correct.`
      );
    }

    // Verify user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (adminError) {
      console.error('Error querying admin_users:', adminError);
      throw new UnauthorizedException(
        `Failed to verify admin status: ${adminError.message}. Make sure SUPABASE_SERVICE_ROLE_KEY is set in backend environment variables.`
      );
    }

    if (!adminUser) {
      throw new UnauthorizedException(
        `User is not an admin. User ID: ${authData.user.id}. Please add this user to the admin_users table.`
      );
    }

    // Generate JWT token
    const payload = {
      sub: authData.user.id,
      email: adminUser.email,
      role: adminUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
    };
  }

  async validateUser(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !adminUser) {
      return null;
    }

    return adminUser;
  }
}

