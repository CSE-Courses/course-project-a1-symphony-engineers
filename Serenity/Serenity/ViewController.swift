//
//  ViewController.swift
//  Serenity
//
//  Created by Anant Patni on 10/18/20.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView!
    
    override func loadView() {
        webView = WKWebView()
        webView.navigationDelegate = self
        view = webView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let url = URL(string: "https://www-student.cse.buffalo.edu/CSE442-542/2020-Fall/cse-442f/course-project-a1-symphony-engineers-develop-2/homePage/homePage.html")!
        webView.load(URLRequest(url: url))
        webView.allowsBackForwardNavigationGestures = true
    }
}

