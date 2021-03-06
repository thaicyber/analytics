import isForm from '../utils/isForm'
import submitForm from './submit'
import filterValues from '../utils/filter'
import { getFormData } from '../utils/getFormValues'

export default function interceptForm(opts = {}, element, type) {
  const { onSubmit, disableFilter, debug } = opts

  const intercept = function (event) {
    event.preventDefault()
    /* Get Raw Form Values */
    const form = event.target
    const rawValues = getFormData(form)
    /* Filter sensitive values */
    const values = (disableFilter) ? rawValues : filterValues(rawValues, opts, type)
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(event, values, {
        type: type,
        form: isForm(element) ? element : null
      })
    }
    if (!debug) {
      /* Release form */
      form.removeEventListener('submit', intercept, false)
      /* Submit original form */
      submitForm(form, { timeout: 0 })
    }
  }
  return intercept
}
