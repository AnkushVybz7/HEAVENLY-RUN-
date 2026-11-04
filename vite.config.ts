import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { sendOtpCode, verifyOtpCode, validateAndConsumeToken } from './src/server/otpService.ts';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Helper to parse JSON body
        const readBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        const json = (statusCode: number, payload: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        };

        const parsedUrl = req.url.split('?')[0];

        try {
          if (req.method === 'POST' && parsedUrl === '/api/otp/send') {
            const body = await readBody();
            const { email, purpose } = body;
            const clientIp = req.socket.remoteAddress || '127.0.0.1';
            const result = await sendOtpCode(email || '', purpose || 'verification', clientIp);
            return json(result.status, result);
          }

          if (req.method === 'POST' && parsedUrl === '/api/otp/verify') {
            const body = await readBody();
            const { email, code, purpose } = body;
            const result = verifyOtpCode(email || '', code || '', purpose || 'verification');
            return json(result.status, result);
          }

          if (req.method === 'POST' && parsedUrl === '/api/forms/submit') {
            const body = await readBody();
            const { email, verificationToken, purpose, formData } = body;

            // Verify single-use token
            const isValid = validateAndConsumeToken(verificationToken, email, purpose);
            if (!isValid) {
              return json(403, {
                success: false,
                error: 'Verification token is invalid, expired, or already used. Please verify your email again.',
              });
            }

            return json(200, {
              success: true,
              message: 'Verified form submission accepted.',
              receivedAt: new Date().toISOString(),
            });
          }

          // Service health / status
          if (req.method === 'GET' && parsedUrl === '/api/otp/status') {
            const hasKey = Boolean(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);
            return json(200, {
              status: 'active',
              emailProviderConfigured: hasKey,
              provider: 'Resend',
            });
          }

          next();
        } catch (err: any) {
          console.error('API Error in dev server:', err);
          return json(500, { success: false, error: 'Internal Server Error' });
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
