
import React, {Component} from 'react'
import Billboard from '@instructure/ui-billboard/lib/components/Billboard'
import Pagination, {PaginationButton} from '@instructure/ui-pagination/lib/components/Pagination'
import Spinner from '@instructure/ui-elements/lib/components/Spinner'
import {array, func, string, shape, oneOf} from 'prop-types'
import View from '@instructure/ui-layout/lib/components/View'
import EmptyDesert from '../EmptyDesert'

const linkPropType = shape({
  url: string.isRequired,
  page: string.isRequired
}).isRequired

export default class SearchMessage extends Component {
  static propTypes = {
    collection: shape({
      data: array.isRequired,
      links: shape({current: linkPropType})
    }).isRequired,
    setPage: func.isRequired,
    noneFoundMessage: string.isRequired,
    getLiveAlertRegion: func,
    dataType: oneOf(['Course', 'User']).isRequired
  }

  static defaultProps = {
    getLiveAlertRegion() {
      return document.getElementById('flash_screenreader_holder')
    }
  }

  state = {}

  componentWillReceiveProps(nextProps) {
    if (!nextProps.collection.loading) {
      const newState = {}
      if (this.state.pageBecomingCurrent) newState.pageBecomingCurrent = null
      this.setState(newState)
    }
  }

  handleSetPage = page => {
    this.setState({pageBecomingCurrent: page}, () => this.props.setPage(page))
  }

  isLastPageUnknown() {
    return !this.props.collection.links.last
  }

  currentPage() {
    return this.state.pageBecomingCurrent || Number(this.props.collection.links.current.page)
  }

  lastKnownPageNumber() {
    const link =
      this.props.collection.links &&
      (this.props.collection.links.last || this.props.collection.links.next)

    if (!link) return 0
    return Number(link.page)
  }

  renderPaginationButton(pageIndex) {
    const pageNumber = pageIndex + 1
    const isCurrent = this.state.pageBecomingCurrent
      ? pageNumber === this.state.pageBecomingCurrent
      : pageNumber === this.currentPage()
    return (
      <PaginationButton
        key={pageNumber}
        onClick={() => this.handleSetPage(pageNumber)}
        current={isCurrent}
        aria-label={`Page ${pageNumber}`}
      >
        {isCurrent && this.state.pageBecomingCurrent ? (
          <Spinner size="x-small" title={'Loading...'} />
        ) : (
          pageNumber
        )}
      </PaginationButton>
    )
  }

  render() {
    console.log("RENDER PAGINATION");
    const {collection, noneFoundMessage} = this.props
    console.log(collection);
    const errorLoadingMessage = 'There was an error with your query; please try a different search'

    if (collection.error) {
      return (
        <div className="text-center pad-box">
          <div className="alert alert-error">{errorLoadingMessage}</div>
        </div>
      )
    } else if (collection.loading) {
      return (
        <View display="block" textAlign="center" padding="medium">
          <Spinner size="medium" title={'Loading...'} />
        </View>
      )
    } else if (!collection.data.length) {
      return (
        <Billboard size="large" heading={noneFoundMessage} headingAs="h2" hero={<EmptyDesert />} />
      )
    } else if (collection.links) {
      const lastPageNumber = this.lastKnownPageNumber()
      const lastIndex = lastPageNumber - 1
      const paginationButtons = Array.from(Array(lastPageNumber))
      paginationButtons[0] = this.renderPaginationButton(0)
      paginationButtons[lastIndex] = this.renderPaginationButton(lastIndex)
      const visiblePageRangeStart = Math.max(this.currentPage() - 10, 0)
      const visiblePageRangeEnd = Math.min(this.currentPage() + 10, lastIndex)
      console.log("visiblePageRangeStart",visiblePageRangeStart);
      console.log("visiblePageRangeEnd",visiblePageRangeEnd)
      for (let i = visiblePageRangeStart; i < visiblePageRangeEnd; i++) {
        paginationButtons[i] = this.renderPaginationButton(i)
      }

      return (
        <Pagination
          as="nav"
          variant="compact"
          labelNext={'Next Page'}
          labelPrev={'Previous Page'}
        >
          {paginationButtons.concat(
            this.isLastPageUnknown() ? (
              <span key="page-count-is-unknown-indicator" aria-hidden>
                ...
              </span>
            ) : (
              []
            )
          )}
        </Pagination>
      )
    } else {
      return <div />
    }
  }
}
