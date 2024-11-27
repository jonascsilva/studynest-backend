import { ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { of } from 'rxjs'

import { LoggingInterceptor } from '$/interceptor/logging.interceptor'

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor
  let loggerMock: Logger

  beforeEach(() => {
    loggerMock = new Logger()

    jest.spyOn(loggerMock, 'log')

    interceptor = new LoggingInterceptor()
    ;(interceptor as any).logger = loggerMock
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should log before and after the handler is called', done => {
    const url = '/test-url'

    const contextMock: ExecutionContext = {
      getArgByIndex: jest.fn().mockReturnValue({ originalUrl: url }),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getType: jest.fn()
    } as any

    const callHandlerMock: CallHandler = {
      handle: jest.fn().mockReturnValue(of('test data'))
    }

    interceptor.intercept(contextMock, callHandlerMock).subscribe(() => {
      expect(loggerMock.log).toHaveBeenCalledTimes(2)
      expect(loggerMock.log).toHaveBeenCalledWith(`Before ${url}`)
      expect(loggerMock.log).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`After ${url}... \\d+ms`))
      )

      done()
    })
  })
})
