import { Avatar } from 'primereact/avatar'
import { Badge } from 'primereact/badge'

export default function UserInfo() {
  return (
    <div className="flex flex-row gap-1">
      <span className="desktop flex-column justify-content-center align-items-end">
        <p className="p-0 m-0 font-semibold">John Doe</p>
        <p className="p-0 m-0">johndoe@gmail.com</p>
      </span>
      <Avatar 
        size="large" 
        shape="circle" 
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" 
      />
    </div>
  )
}