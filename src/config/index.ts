import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';

export { appConfig, jwtConfig, databaseConfig };

// Export an array of config factories compatible with ConfigModule.forRoot({ load })
const configs = [appConfig, jwtConfig, databaseConfig];
export default configs;
