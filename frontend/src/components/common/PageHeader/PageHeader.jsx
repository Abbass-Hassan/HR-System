import './PageHeader.css'
import DateDisplay from '../DateDisplay/DateDisplay'

const PageHeader = ({ title, subTitle, subSubTitle }) => {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return (
    <div className='page-header'>
      <div>
        <h1 className='page-header-title'>{title}</h1>
        <div className='page-header-subtitle'>
          <span className='page-header-sublink'>{subTitle}</span>
          <span className='page-header-separator'> / </span>
          <span className='page-header-subsublink'>{subSubTitle}</span>
        </div>
      </div>
      <DateDisplay
        date={formattedDate}
        className='header-date'
      />
    </div>
  )
}

export default PageHeader
