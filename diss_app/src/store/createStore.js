
import parseLinkHeader from 'parse-link-header'
import ajaxJSON from '../jquery.ajaxJSON'

/**
 * Build a store that support basic ajax fetching (first, next, all),
 * and caches the results by params.
 *
 * You only need to implement getUrl, and can optionally implement
 * normalizeParams and jsonKey
 */
export default function factory(spec) {
  return Object.assign(
    {
      normalizeParams: params => params,

      getUrl() {
        throw new Error('not implemented')
      },

      /**
       * If the API response is an object instead of an array, use this
       * to specify the key containing the actual array of results
       */
      jsonKey: null,

      /**
       * Load the first page of data for the given params
       */
      load(params) {
        // const key = this.getKey(params)
        const key = "";
        this.lastParams = params
        const normalizedParams = this.normalizeParams(params)
        const url = this.getUrl()

        return this._load(key, url, normalizedParams)
      },

      _load(key, url, params, options = {}) {
        ajaxJSON.abortRequest(this.previousLoadRequest)
        const xhr = ajaxJSON(url, 'GET', params)
        this.previousLoadRequest = xhr

        return xhr;
      },
    },
    spec
  )
}
