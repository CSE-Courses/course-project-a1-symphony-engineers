//
//  TabBarController.swift
//  Serenity
//
//  Created by Anant Patni on 11/29/20.
//

import UIKit

class TabBarController: UITabBarController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        UITabBarItem.appearance().titlePositionAdjustment = UIOffset(horizontal: 0, vertical: 7)
        let fontConfiguration = UIFont.systemFont(ofSize: 20)
        tabBar.barTintColor = .black
        tabBar.unselectedItemTintColor = .white
        UITabBar.appearance().tintColor = .cyan

        let firstViewController = SerenityController()
                
        firstViewController.tabBarItem = UITabBarItem(title: "Serenity", image: UIImage(systemName: "smiley.fill", withConfiguration: UIImage.SymbolConfiguration(font: fontConfiguration, scale: .large))?.withRenderingMode(.alwaysTemplate), selectedImage: UIImage(systemName: "smiley.fill", withConfiguration: UIImage.SymbolConfiguration(font: fontConfiguration, scale: .large))?.withRenderingMode(.alwaysTemplate))

        let secondViewController = MapController()

        secondViewController.tabBarItem = UITabBarItem(title: "Places Near Me", image: UIImage(systemName: "mappin.and.ellipse", withConfiguration: UIImage.SymbolConfiguration(font: fontConfiguration, scale: .large))?.withRenderingMode(.alwaysTemplate), selectedImage: UIImage(systemName: "mappin.and.ellipse", withConfiguration: UIImage.SymbolConfiguration(font: fontConfiguration, scale: .large))?.withRenderingMode(.alwaysTemplate))

        let tabBarList = [firstViewController, secondViewController]

        viewControllers = tabBarList
    }

}
