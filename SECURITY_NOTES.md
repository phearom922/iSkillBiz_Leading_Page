# Security Notes

## Known Vulnerabilities

### Multer 1.x (Backend)
- **Status**: Known vulnerabilities in multer 1.x
- **Impact**: Low (only affects file uploads, which are protected by authentication)
- **Reason**: NestJS currently depends on multer 1.x through `@nestjs/platform-express`
- **Action**: Monitor for NestJS updates that include multer 2.x
- **Mitigation**: 
  - File uploads are protected by JWT authentication
  - File types and sizes are validated
  - Files are stored in Supabase Storage (not on the server)

### Deprecated Packages
The following warnings are from transitive dependencies and cannot be directly fixed:
- `glob@7.2.3` - Used by other packages
- `@humanwhocodes/object-schema@2.0.3` - Used by ESLint
- `superagent@8.1.2` - Used by other packages

These are warnings, not critical security issues. They will be resolved when the parent packages update their dependencies.

## Recommendations

1. **Regular Updates**: Run `npm audit` regularly and update packages when possible
2. **Monitor Dependencies**: Keep an eye on NestJS and Next.js updates
3. **Production**: Ensure all environment variables are properly secured
4. **Authentication**: All admin routes are protected with JWT
5. **File Uploads**: Validate file types and sizes on both client and server

## Running Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix non-breaking issues
npm audit fix

# View detailed report
npm audit --json
```

