import SandboxBanner from '../SandboxBanner'

export default function SandboxBannerExample() {
  return (
    <SandboxBanner onDismiss={() => console.log('Sandbox banner dismissed')} />
  )
}
