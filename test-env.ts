// Teste temporário para verificar as variáveis de ambiente
console.log('=== VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '***' + process.env.GOOGLE_CLIENT_SECRET.slice(-4) : 'UNDEFINED');
console.log('BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL);
console.log('===========================================');

export {};
