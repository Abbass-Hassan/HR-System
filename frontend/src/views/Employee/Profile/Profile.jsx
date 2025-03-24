import './Profile.css'
import PageHeader from '../../../components/common/PageHeader/PageHeader'
import profileImage from '../../../assets/images/rechardHendricks.jpg'
import iconFirstName from '../../../assets/images/first_name.svg'
import iconEmail from '../../../assets/images/email.svg'
import iconPassword from '../../../assets/images/password.svg'
import iconPhone from '../../../assets/images/phone.svg'

import { useState } from 'react'
const Profile = () => {
  const [employee, setEmployee] = useState({
    first_name: 'Rechard',
    last_name: 'Hendricks',
    phoneNb: '71 505 894',
    email: 'rechard.hendricks@gmail.com',
  })
  const [changePassword, setChangePassword] = useState(false)

  const handleSubmitProfile = async (e) => {
    e.preventDefault()
    console.log('handleSubmitProfile clicked')
  }
  return (
    <div className='employee-profile-page'>
      <PageHeader
        title={'Employee Profile'}
        subTitle={'Employee'}
        subSubTitle={'Profile'}
      />
      <div className='employee-profile'>
        <div className='inside-container'>
          <div className='profile-image-title'>
            <img
              className='profile-image'
              src={profileImage}
              alt='profile-image.jpg'
            />
            <div className='profile-employee-name'>{`${employee.first_name} ${employee.last_name}`}</div>
          </div>
          <form className='profile-form'>
            {/* row 2 inputs next to each other  */}
            <div className='two-form-inputs'>
              <div className='form-input'>
                <label>First Name</label>
                <div className='form-input-icon'>
                  <input
                    type='text'
                    value={employee.first_name}
                  />
                  <img
                    className='input-icon'
                    src={iconFirstName}
                    alt='icon-first-name.svg'
                  />
                </div>
              </div>
              <div className='form-input'>
                <label>Last Name</label>
                <div className='form-input-icon'>
                  <input
                    type='text'
                    value={employee.last_name}
                  />
                  <img
                    className='input-icon'
                    src={iconFirstName}
                    alt='icon-first-name.svg'
                  />
                </div>
              </div>
            </div>
            {/* row 2 inputs next to each other  */}

            {/* row 2 inputs next to each other  */}
            <div className='two-form-inputs'>
              <div className='form-input'>
                <label>Email</label>
                <div className='form-input-icon'>
                  <input
                    type='email'
                    value={employee.email}
                  />
                  <img
                    className='input-icon'
                    src={iconEmail}
                    alt='icon-email-name.svg'
                  />
                </div>
              </div>
              <div className='form-input'>
                <label>Phone</label>
                <div className='form-input-icon'>
                  <input
                    type='text'
                    value={employee.phoneNb}
                  />
                  <img
                    className='input-icon'
                    src={iconPhone}
                    alt='icon-phone-name.svg'
                  />
                </div>
              </div>
            </div>
            {/* row 2 inputs next to each other  */}

            <div className='change-password-container'>
              <label>Change Password</label>
              <br />
              <label className='switch'>
                <input
                  type='checkbox'
                  checked={changePassword}
                  onChange={() => setChangePassword(!changePassword)}
                />
                <span className='slider round'></span>
              </label>
            </div>

            {/* row 2 inputs next to each other  */}
            {changePassword && (
              <>
                <div className='two-form-inputs'>
                  <div className='form-input'>
                    <label>Password</label>
                    <div className='form-input-icon'>
                      <input
                        type='password'
                        value={'paswrod value'}
                      />
                      <img
                        className='input-icon'
                        src={iconPassword}
                        alt='icon-password-name.svg'
                      />
                    </div>
                  </div>
                  <div className='form-input'>
                    <label>Confirm Password</label>
                    <div className='form-input-icon'>
                      <input
                        type='password'
                        value={'Confirm Password value'}
                      />
                      <img
                        className='input-icon'
                        src={iconPassword}
                        alt='icon-password-name.svg'
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* row 2 inputs next to each other  */}
            <button
              className='button-submit-profile'
              onClick={handleSubmitProfile}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
