'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'


export default function Login() {

  const router = useRouter()
  const [checked, setChecked] = useState(false)

  return (
    <section className="flex flex-column align-items-center justify-content-center h-screen">
      <div className="flex align-items-center justify-content-center w-11">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
          <span>
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="text"
              placeholder="Email address"
              className="w-full mb-3"
            />

            <label htmlFor="password" className="block text-900 font-medium mb-2">
              Password
            </label>
            <InputText
              id="password"
              type="password"
              placeholder="Password"
              className="w-full mb-3"
            />

            <div className="flex align-items-center justify-content-between mb-6">
              <div className="flex align-items-center">
                <Checkbox
                  id="rememberme"
                  onChange={(e) => setChecked(e.checked)}
                  checked={checked}
                  className="mr-2"
                />
                <label htmlFor="rememberme">Remember me</label>
              </div>
              <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                Forgot your password?
              </a>
            </div>

            <Button 
              label="Sign In" 
              icon="pi pi-user" 
              className="w-full"
              onClick={() => router.push('/dashboard')} 
            />
          </span>
          <span className="text-center mb-5">
            <span className="text-600 font-medium line-height-3">
              Dont have an account?
            </span>
            <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
              Create today!
            </a>
          </span>
        </div>
      </div>
    </section>
  )
}
