# Ofrenda for express

*12 departed files, remembered by gemma3:4b running locally. Built with git-ofrenda 0.1.0.*

## lib/express/core.js

> **“Body” rejected, cruft purged, a simpler route now flows.**

2009-11-30 to 2010-06-18 · 200 days · 222 commits · 6 keepers

This core file, born in 2009, diligently handled requests before its removal in 2010, streamlining the Express project with 289 lines of code.

*Cause of death:* `a62a5d0d` Removed old cruft

<details><summary>Last words</summary>

```
    request.trigger('request', function(err) {
      try {
        if (err) throw err
        if (request.response.finished) return
        if (typeof (body = (new Router(request)).route()) === 'string')
          request.respond(200, body)
      } catch (err) {
        request.error(err)
      }
    })
  }
})
```
</details>

## lib/express/request.js

> **“Isxhr” departed, seeking a simpler connection.**

2009-12-15 to 2011-02-03 · 1 year · 143 commits · 5 keepers

This Request file, born in 2009, served its purpose with 277 lines and 143 touches, finally succumbing to a submodule update in 2011.

*Cause of death:* `42af4e40` Updated connect submodule

<details><summary>Last words</summary>

```
// Callback for isXMLHttpRequest / xhr
function isxhr() {
  return this.header('X-Requested-With', '').toLowerCase() === 'xmlhttprequest';
}
/**
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @api public
 */
http.IncomingMessage.prototype.__defineGetter__('isXMLHttpRequest', isxhr);
http.IncomingMessage.prototype.__defineGetter__('xhr', isxhr);
```
</details>

## test/view.test.js

> **“Hello.jade”’s rendering ceased, a quiet, final view.**

2010-07-05 to 2011-11-08 · 1 year · 134 commits · 3 keepers

This test file, born in 2010, diligently rendered ‘hello.jade’ for a year, finally succumbing to the "Remove old tests" command, leaving 1056 lines behind.

*Cause of death:* `9efc4b23` Remove old tests

<details><summary>Last words</summary>

```
  },
  'test charset override': function(){
    var app = create();
    app.locals.charset = 'ISO-8859-1';
    app.get('/', function(req, res){
      res.render('hello.jade', { charset: 'utf8' });
    });
    assert.response(app,
      { url: '/' },
      { headers: { 'Content-Type': 'text/html; charset=utf8' }});
  }
};
```
</details>

## lib/router/index.js

> **Arguments assembled, then swiftly, silently, dismissed.**

2011-04-25 to 2015-07-06 · 4 years · 129 commits · 18 keepers

This index file, born in 2011, diligently handled function arguments before its quiet removal in 2015, a necessary step towards a streamlined routing system. Its 626 lines and 129 touches represent a focused period of service, ultimately superseded by a more modern approach.

*Cause of death:* `cec5780d` Use router module for routing

<details><summary>Last words</summary>

```
}
// wrap a function
function wrap(old, fn) {
  return function proxy() {
    var args = new Array(arguments.length + 1);
    args[0] = old;
    for (var i = 0, len = arguments.length; i < len; i++) {
      args[i + 1] = arguments[i];
    }
    fn.apply(this, args);
  };
}
```
</details>

## lib/express/view.js

> **“Return str;” – A final, insistent plea.**

2009-11-30 to 2011-02-03 · 1 year · 128 commits · 8 keepers

This view component, born in 2009, diligently handled string rendering, ultimately succumbing to a submodule update in 2011, after 128 touches.

*Cause of death:* `42af4e40` Updated connect submodule

<details><summary>Last words</summary>

```
    options.layout = false;
    options.body = str;
    options.relative = false;
    self.render(layout, options, fn, view);
  } else if (partial) {
    return str;
  } else if (fn) {
    fn(null, str);
  } else {
    this.send(str, options.headers, options.status);
  }
};
```
</details>

## test/response.test.js

> **“hey” – a final, bewildered message.**

2010-07-05 to 2011-11-08 · 1 year · 103 commits · 4 keepers

This small file, born in 2010 and swiftly dispatched in 2011, served only to declare “hey” and confirm a character set, quietly fading after a brief, well-maintained existence.

*Cause of death:* `9efc4b23` Remove old tests

<details><summary>Last words</summary>

```
    },
    'test .charset with res.send()': function(){
      var app = express.createServer();
      app.get('/', function(req, res){
        res.charset = 'ISO-8859-1';
        res.send('<p>hey</p>');
      });
      assert.response(app,
        { url: '/' },
        { headers: { 'Content-Type': 'text/html; charset=ISO-8859-1' }});
    }
};
```
</details>

## spec/spec.core.js

> **“Should throw an error,” a final, unfulfilled plea.**

2009-06-26 to 2010-07-05 · 1 year · 68 commits · 2 keepers

This spec, born in 2009, ceased to exist with a simple “Removed specs,” a quiet expiration after a year of diligent tending by visionmedia and csausdev, leaving only 93 lines behind.

*Cause of death:* `f97a222c` Removed specs

<details><summary>Last words</summary>

```
        configure('test')
        order.should.eql ['a', 'c', 'd']
      end
    end
    describe 'given no arguments'
      it 'should throw an error'
        // TODO: tighter spec once JSpec is fixed
        -{ configure() }.should.throw_error
      end
    end
  end
end
```
</details>

## lib/express/plugins/view.js

> **“Null” was its last word, a clean, decisive end.**

2009-12-17 to 2010-06-18 · 183 days · 64 commits · 6 keepers

This plugin, born in 2009 and purged in 2010, served its purpose with 194 lines of code, tending to a brief but impactful existence.

*Cause of death:* `a62a5d0d` Removed old cruft

<details><summary>Last words</summary>

```
            }), callback)
          } else if (type === 'partials')
            return content
          else if (callback)
            callback.call(this, null, content)
          else
            this.respond(200, content, options.encoding)
        }
      })
    }
  }
})
```
</details>

## lib/express/collection.js

> **Collection born, Collection gone, a swift transition.**

2009-12-03 to 2010-03-10 · 97 days · 60 commits · 2 keepers

This file, created in 2009 and removed in 2010, diligently handled array conversions, a brief but impactful 97-day existence.

*Cause of death:* `b0473250` Updated ext and removed Collection

<details><summary>Last words</summary>

```
})
/**
 * Create a new collection from an array-like object.
 *
 * @param  {object} arr
 * @return {Collection}
 * @api public
 */
var $ = exports.$ = function(arr) {
  if (arr instanceof Collection) return arr
  return new Collection(arr)
}
```
</details>

## lib/http.js

> **“All” methods handled, then swiftly deleted, a quiet end.**

2011-03-01 to 2011-10-07 · 220 days · 56 commits · 2 keepers

This humble http.js, born in 2011, served its purpose briefly, guided by Tj and Ben, before a simple “removed old http.js” brought its 220 days to a close.

*Cause of death:* `02baa2b1` removed old http.js

<details><summary>Last words</summary>

```
 */
app.all = function(path){
  var args = arguments;
  if (1 == args.length) return this.routes.lookup('all', path);
  methods.forEach(function(method){
    if ('all' == method) return;
    app[method].apply(this, args);
  }, this);
  return this;
};
// del -> delete alias
app.del = app.delete;
```
</details>

## spec/spec.collection.js

> **“Foo: bar” – a final, insistent declaration.**

2009-12-03 to 2010-03-10 · 97 days · 49 commits · 1 keepers

This collection spec, born in 2009 and extinguished in 2010, diligently tested nested arrays, ultimately failing to match its predicted output.

*Cause of death:* `4b1c39fe` Removed Collection specs

<details><summary>Last words</summary>

```
      it 'should output [Collection ...] for array'
        $([1,2,3]).toString().should.eql '[Collection 1,2,3]'
      end
      it 'should output [Collection [object Object]] for object'
        $({ foo: "bar" }).toString().should.eql '[Collection [object Object]]'
      end
      it 'should output [Collection [[Collection ...]]] for nested collections'
        $([$([1,2,3])]).toString().should.eql '[Collection [Collection 1,2,3]]'
      end
    end
  end
end
```
</details>

## examples/chat/app.js

> **JSON encoded messages, a final, fleeting send.**

2010-01-18 to 2010-07-05 · 168 days · 49 commits · 4 keepers

This example application, born in 2010, served a simple purpose before its quiet removal, marking 168 days of existence and a final transmission.

*Cause of death:* `730f4542` Removed examples

<details><summary>Last words</summary>

```
    var previousLength = messages.length;
    var id = setInterval(function(){
        if (messages.length > previousLength) {
            previousLength = messages.length;
            res.writeHead(200, {
               'Content-Type': 'application/json'
            });
            res.end(JSON.encode(messages));
            clearInterval(id);
        }
    }, 100);
});
```
</details>
