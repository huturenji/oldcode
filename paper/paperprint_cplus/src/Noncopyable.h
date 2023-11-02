#ifndef SINO_PAPERPRINT_NONCOPYABLE_H_
#define SINO_PAPERPRINT_NONCOPYABLE_H_


class Noncopyable
{
protected:
    Noncopyable() { }
    virtual ~Noncopyable() { }
private:
    Noncopyable(const Noncopyable&); /* 禁止拷贝构造 */
    const Noncopyable& operator=(const Noncopyable&); /* 禁止拷贝赋值 */
};

#endif // SINO_PAPERPRINT_NONCOPYABLE_H_
