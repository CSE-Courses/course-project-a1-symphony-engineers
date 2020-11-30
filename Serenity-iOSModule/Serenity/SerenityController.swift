//
//  SerenityController.swift
//  Serenity
//
//  Created by Anant Patni on 10/18/20.
//

import UIKit
import WebKit

class SerenityController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView!
    
    override func loadView() {
        webView = WKWebView()
        webView.navigationDelegate = self
        view = webView
    }
    
    //Comment
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let url = URL(string: "https://afternoon-spire-76193.herokuapp.com/")!
        webView.load(URLRequest(url: url))
        webView.allowsBackForwardNavigationGestures = true
    }
}

