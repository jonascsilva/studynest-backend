import { CallHandler, ExecutionContext } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { of } from 'rxjs'

import { SerializeInterceptor } from '$/interceptor/serialize.interceptor'

describe('SerializeInterceptor', () => {
  let interceptor: SerializeInterceptor

  class TestDto {
    @Expose()
    prop1: string

    @Expose()
    prop2: number

    prop3: boolean
  }

  beforeEach(() => {
    interceptor = new SerializeInterceptor(TestDto)
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  describe('intercept', () => {
    it('should transform the data and exclude extraneous values', done => {
      const data = {
        prop1: 'value1',
        prop2: 42,
        prop3: true,
        extraProp: 'should be excluded'
      }

      const expectedData = {
        prop1: 'value1',
        prop2: 42
      }

      const callHandler: CallHandler = {
        handle: () => of(data)
      }

      const executionContext = {} as ExecutionContext

      const result$ = interceptor.intercept(executionContext, callHandler)

      result$.subscribe(result => {
        expect(result).toEqual(expectedData)
        done()
      })
    })
  })
})
