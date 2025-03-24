import './Payslip.css'
import PageHeader from '../../../components/common/PageHeader/PageHeader'

const Payslip = () => {

  const handlePrintPaySlip = () => {
    console.log('handlePrintPaySlip clicked')
  }

  return (
    <div className='employee-payslip-page'>
      <PageHeader
        title={'Employee Payslip'}
        subTitle={'Employee'}
        subSubTitle={'Payslip'}
      />
      <div className='employee-payslip-container'>
        <div className='payslip-titile'>Payslip - March 2025</div>
        <div className='payslip-headings'>
          <div className='paysli-employee-details'>
            <div className='head-item'>
              <span>Name:</span> Rechard Hendricks
            </div>
            <div className='head-item'>
              <span>Designation:</span> Sales Executive
            </div>
            <div className='head-item'>
              <span>Department:</span> Sales
            </div>
          </div>
          <div className='payslip-company'>
            <div className='payslip-company-name'>Crewmate</div>
            <div className='payslip-company-address'>1234 St West, Sample </div>
          </div>
        </div>

        {/* rows of the table */}
        <div className='row row-head'>
          <div className='row-item'>{'Earnings'}</div>
          <div className='row-item'>{'Amount'}</div>
        </div>
        <div className='row'>
          <div className='row-item'>{'Base Salary'}</div>
          <div className='row-item'>{'12,000'}</div>
        </div>
        <div className='row'>
          <div className='row-item'>{'Incentive Pay'}</div>
          <div className='row-item'>{'1,500'}</div>
        </div>
        <div className='row'>
          <div className='row-item'>{'House Rent Allowance'}</div>
          <div className='row-item'>{'800'}</div>
        </div>
        <div className='row'>
          <div className='row-item'></div>
          <div className='row-item total'>{'14,300'}</div>
        </div>
        {/* rows of the table */}

        {/* rows of the table */}
        <div className='row row-head'>
          <div className='row-item'>{'Deductions'}</div>
          <div className='row-item'></div>
        </div>
        <div className='row'>
          <div className='row-item'>{'Provident Fun'}</div>
          <div className='row-item'>{'1,500'}</div>
        </div>
        <div className='row'>
          <div className='row-item'>{'Incentive Pay'}</div>
          <div className='row-item'>{'600'}</div>
        </div>
        <div className='row'>
          <div className='row-item'>{'House Rent Allowance'}</div>
          <div className='row-item'>{'500'}</div>
        </div>
        <div className='row'>
          <div className='row-item'></div>
          <div className='row-item total'>{'2,600'}</div>
        </div>
        {/* rows of the table */}
        <div className='row row-head'>
          <div className='row-item'>Net Pay</div>
          <div className='row-item'>11,700</div>
        </div>

        <button
          className='button-payslip-print'
          onClick={handlePrintPaySlip}
        >
          Print
        </button>
      </div>
    </div>
  )
}

export default Payslip
