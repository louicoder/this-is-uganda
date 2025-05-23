import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import react_native_ota_hot_update

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "thisisuganda"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    // Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    // OTA managed bundle handling:
    // https://github.com/vantuan88291/react-native-ota-hot-update
    OtaHotUpdate.getBundle()
#endif
  }
}
