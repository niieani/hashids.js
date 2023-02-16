/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'nodemark' {
  class BenchmarkResult {
    /** the average measured time in nanoseconds */
    mean: number
    /** the margin of error as a ratio of the mean */
    error: number
    /** the fastest measured time in nanoseconds */
    max: number
    /** the slowest measured time in nanoseconds */
    min: number
    /** the number of times the subject was invoked and measured */
    count: number

    /**
     * Returns this.mean, rounded to the nearest whole number
     * or the number of decimal places specified by `precision`
     */
    nanoseconds(precision?: number): number
    /**
     * Returns this.mean, rounded to the nearest whole number
     * or the number of decimal places specified by `precision`
     */
    microseconds(precision?: number): number
    /**
     * Returns this.mean, rounded to the nearest whole number
     * or the number of decimal places specified by `precision`
     */
    milliseconds(precision?: number): number
    /**
     * Returns this.mean, rounded to the nearest whole number
     * or the number of decimal places specified by `precision`
     */
    seconds(precision?: number): number
    /**
     * Returns the average number of executions per second,
     * rounded to the nearest whole number or the number of decimal places specified by precision.
     */
    hz(precision?: number): number
    /**
     * Returns the standard deviation per second,
     * rounded to the nearest whole number or the number of decimal places specified by precision.
     */
    sd(precision?: number): number

    /**
     * Returns a nicely formatted string describing the result of the benchmark.
     * By default, the "hz" format is used, which displays ops/sec,
     * but you can optionally specify "nanoseconds", "microseconds", "milliseconds",
     * or "seconds" to change the displayed information.
     */
    toString(
      format?:
        | 'hz'
        | 'nanoseconds'
        | 'microseconds'
        | 'milliseconds'
        | 'seconds',
    ): string
  }
  const benchmark: {
    (
      subject: () => any,
      setup?: () => any,
      durationMillis?: number,
    ): BenchmarkResult
    (
      subject: (callback: (...args: unknown[]) => void) => any,
      setup?: () => any,
      durationMillis?: number,
    ): Promise<BenchmarkResult>
  }
  export = benchmark
}

declare module 'require-from-web' {
  function requireFromWeb<T>(url: string): Promise<T>
  export = requireFromWeb
}
