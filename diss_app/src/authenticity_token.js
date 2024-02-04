

import $ from 'jquery'
import 'jquery.cookie'

const authenticity_token = () => $.cookie('_csrf_token')

$(document).on('submit', 'form', function () {
  $(this).find('input[name="authenticity_token"]').val(authenticity_token())
})

// return a function to be used elsewhere
export default authenticity_token