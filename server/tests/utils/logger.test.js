const winston = require('winston');
const logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');

describe('Logger Utility', () => {
  const logsDir = path.join(__dirname, '../../logs');
  
  beforeAll(() => {
    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up log files after each test
    const logFiles = ['error.log', 'combined.log'];
    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  it('should be a winston logger instance', () => {
    expect(logger).toBeInstanceOf(winston.Logger);
  });

  it('should have correct log level', () => {
    expect(logger.level).toBe(process.env.LOG_LEVEL || 'info');
  });

  it('should have file transports configured', () => {
    const fileTransports = logger.transports.filter(
      transport => transport instanceof winston.transports.File
    );
    
    expect(fileTransports).toHaveLength(2);
    
    const errorTransport = fileTransports.find(t => t.level === 'error');
    const combinedTransport = fileTransports.find(t => !t.level);
    
    expect(errorTransport).toBeDefined();
    expect(combinedTransport).toBeDefined();
  });

  it('should log info messages', (done) => {
    const testMessage = 'Test info message';
    
    logger.info(testMessage);
    
    // Give some time for the log to be written
    setTimeout(() => {
      const combinedLogPath = path.join(logsDir, 'combined.log');
      
      if (fs.existsSync(combinedLogPath)) {
        const logContent = fs.readFileSync(combinedLogPath, 'utf8');
        expect(logContent).toContain(testMessage);
        expect(logContent).toContain('"level":"info"');
      }
      
      done();
    }, 100);
  });

  it('should log error messages', (done) => {
    const testMessage = 'Test error message';
    
    logger.error(testMessage);
    
    // Give some time for the log to be written
    setTimeout(() => {
      const errorLogPath = path.join(logsDir, 'error.log');
      
      if (fs.existsSync(errorLogPath)) {
        const logContent = fs.readFileSync(errorLogPath, 'utf8');
        expect(logContent).toContain(testMessage);
        expect(logContent).toContain('"level":"error"');
      }
      
      done();
    }, 100);
  });

  it('should include timestamp in log format', (done) => {
    const testMessage = 'Test timestamp message';
    
    logger.info(testMessage);
    
    setTimeout(() => {
      const combinedLogPath = path.join(logsDir, 'combined.log');
      
      if (fs.existsSync(combinedLogPath)) {
        const logContent = fs.readFileSync(combinedLogPath, 'utf8');
        expect(logContent).toMatch(/"timestamp":"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}"/);
      }
      
      done();
    }, 100);
  });

  it('should include service metadata', (done) => {
    const testMessage = 'Test service metadata';
    
    logger.info(testMessage);
    
    setTimeout(() => {
      const combinedLogPath = path.join(logsDir, 'combined.log');
      
      if (fs.existsSync(combinedLogPath)) {
        const logContent = fs.readFileSync(combinedLogPath, 'utf8');
        expect(logContent).toContain('"service":"mern-testing-app"');
      }
      
      done();
    }, 100);
  });

  it('should handle error objects with stack traces', (done) => {
    const testError = new Error('Test error with stack');
    
    logger.error('Error occurred', testError);
    
    setTimeout(() => {
      const errorLogPath = path.join(logsDir, 'error.log');
      
      if (fs.existsSync(errorLogPath)) {
        const logContent = fs.readFileSync(errorLogPath, 'utf8');
        expect(logContent).toContain('Test error with stack');
        expect(logContent).toContain('"stack"');
      }
      
      done();
    }, 100);
  });
});